import { createSlice } from '@reduxjs/toolkit';
import { coproductionProcessesApi, coproductionSchemasApi, tasksApi, objectivesApi, phasesApi, assetsApi } from '../__fakeApi__';
import moment from "moment"
import generateGraph from 'pages/dashboard/coproductionprocesses/Tabs/Network/graph';
import { comparePrerequisites } from 'utils/comparePrerequisites';

const initialState = {
  loading: false,
  updating: false,
  process: null,
  tasks: [],
  objectives: [],
  phases: [],
  selectedPhaseTab: "",
  selectedTask: null,
  network: null,
  
};

const valid_obj_types = ["task", "objective", "phase"]

const updateDatesForObject = (state, id, objType, childType) => {
  const obj = state[`${objType}s`].find(el => el.id === id)
  if (obj && valid_obj_types.includes(objType) && valid_obj_types.includes(childType)) {
    let start_date = null
    let end_date = null

    state[`${childType}s`].filter(el => el[`${objType}_id`] === obj.id).forEach(child => {
      if (child.start_date) {
        let tempDate = moment(child.start_date, 'YYYY-MM-DD')
        if (!start_date || tempDate.diff(start_date) < 0) {
          start_date = tempDate
        }
      }

      if (child.end_date) {
        let tempDate = moment(child.end_date, 'YYYY-MM-DD')
        if (!end_date || tempDate.diff(end_date) >= 0) {
          end_date = tempDate
        }
      }
    });

    obj.start_date = moment.isMoment(start_date) ? start_date.format('YYYY-MM-DD') : null
    obj.end_date = moment.isMoment(end_date) ? end_date.format('YYYY-MM-DD') : null
    return [obj.start_date, obj.end_date]
  }
  console.error(obj, objType, childType)
  throw Error("Invalid object or objTypes");
}

const updateProgressForObject = (state, id, objType, childType) => {
  const obj = state[`${objType}s`].find(el => el.id === id)
  if (obj && valid_obj_types.includes(objType) && valid_obj_types.includes(childType)) {
    let statuses = state[`${childType}s`].filter(el => el[`${objType}_id`] === obj.id).map(child => child.status)
    let status;
    if (statuses.every(child => child.status === "awaiting")){
      status = "awaiting"
    }
    else if(statuses.every(child => child.status === "finished")){
      status = "finished"
    }
    else {
      status = "in_progress"
    }
    return status
  }
  console.error(obj, objType, childType)
  throw Error("Invalid object or objTypes");
}

const slice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setProcessTree(state, action) {
      const phases = []
      const objectives = []
      const tasks = []

      console.log(action)
      if (action.payload) {
        // separate tree into groups
        action.payload.forEach(phase => {
          phase.objectives.forEach(objective => {
            objective.tasks.forEach(task => {
              tasks.push(task)
            });
            objectives.push(objective)
          });
          phases.push(phase)
        });
        state.tasks = tasks;
        state.objectives = objectives;


        const orderedPhases = [...phases].sort(comparePrerequisites)
        state.phases = orderedPhases;
        state.selectedPhaseTab = orderedPhases.length > 0 ? orderedPhases[0].name : ""
      }

    },
    setSelectedTask(state, action) {
      state.selectedTask = action.payload;
    },
    setProcess(state, action) {
      state.process = action.payload;
      // state.network = generateGraph(state.process);
      // TODO: set tab depending on progress
      console.log("SETTING SELECTED TASK NULL")
      state.selectedTask = null
    },
    updatePhase(state, action) {
      state.phases = state.phases.map(obj => obj.id === action.payload.id ? action.payload : obj);
    },
    updateObjective(state, action) {
      state.objectives = state.objectives.map(obj => obj.id === action.payload.id ? action.payload : obj);
      // updateDatesForObject(state, action.payload.phase_id, "phase", "objective")
      // updateProgressForObject(state, action.payload.phase_id, "phase", "objective")
    },
    updateTask(state, action) {
      state.tasks = state.tasks.map(obj => obj.id === action.payload.id ? action.payload : obj);
      // updateDatesForObject(state, action.payload.objective_id, "objective", "task")
      // updateProgressForObject(state, action.payload.objective_id, "objective", "task")
      if (state.selectedTask.id === action.payload.id){
        state.selectedTask = action.payload
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUpdating(state, action) {
      state.updating = action.payload;
    },
    setSelectedPhase(state, action) {
      state.selectedPhaseTab = action.payload;
      state.selectedTask = null
    },
  }
});

export const { reducer } = slice;

export const setSelectedTask = (data) => async (dispatch) => {
  dispatch(slice.actions.setSelectedTask(data));
};


export const setProcess = (data) => async (dispatch) => {
  const treeData = await coproductionProcessesApi.getTree(data.id)
  dispatch(slice.actions.setProcess(data));
  dispatch(slice.actions.setProcessTree(treeData));
};


export const getProcess = (processId) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  const data = await coproductionProcessesApi.get(processId)
  const treeData = await coproductionProcessesApi.getTree(processId)
  dispatch(slice.actions.setProcess(data));
  dispatch(slice.actions.setProcessTree(treeData));
  dispatch(slice.actions.setLoading(false));
};

export const updateProcess = ({ id, data, onSuccess }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  const updatedData = await coproductionProcessesApi.update(id, data);
  dispatch(slice.actions.setProcess(updatedData));
  dispatch(slice.actions.setUpdating(false));
  if (onSuccess) {
    onSuccess()
  }
};

export const updateTask = ({ id, data }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  const updatedData = await tasksApi.update(id, data)
  dispatch(slice.actions.updateTask(updatedData));
  // update parent objective
  const updatedObjectiveData = await objectivesApi.get(updatedData.objective_id)
  dispatch(slice.actions.updateObjective(updatedObjectiveData));
  // update parent phase
  const updatedPhaseData = await phasesApi.get(updatedObjectiveData.phase_id)
  dispatch(slice.actions.updatePhase(updatedPhaseData));
  dispatch(slice.actions.setUpdating(false));
};

export const updateObjective = ({ id, data }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  const updatedData = await objectivesApi.update(id, data)
  dispatch(slice.actions.updateObjective(updatedData));
  // update parent phase
  // const updatedPhaseData = await phasesApi.get(updatedData.phase_id)
  // dispatch(slice.actions.updatePhase(updatedPhaseData));
  dispatch(slice.actions.setUpdating(false));
};

export const updatePhase = ({ id, data }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  const updatedData = await phasesApi.update(id, data)
  dispatch(slice.actions.updatePhase(updatedData));
  dispatch(slice.actions.setUpdating(false));
};

export const setSelectedPhaseTab = (data) => async (dispatch) => {
  dispatch(slice.actions.setSelectedPhase(data));
};

export default slice;
