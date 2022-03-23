import { createSlice } from '@reduxjs/toolkit';
import { coproductionProcessesApi, coproductionSchemasApi, tasksApi, objectivesApi, phasesApi, assetsApi, softwareInterlinkersApi } from '../__fakeApi__';
import moment from "moment"
import generateGraph from 'pages/dashboard/coproductionprocesses/Tabs/Network/graph';
import { topologicalSort } from 'utils/comparePrerequisites';

const initialState = {
  loading: false,
  updating: false,
  updatingTree: false,
  process: null,
  tasks: [],
  objectives: [],
  phases: [],
  allItems: [],
  selectedPhaseTabId: "",
  selectedTreeItem: null,
  network: null,
  softwareInterlinkers: [],
  loadingSoftwareInterlinkers: false
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
        state.allItems = phases.concat(objectives).concat(tasks)
        const orderedTasks = topologicalSort([...tasks])
        state.tasks = orderedTasks;
        const orderedObjectives = topologicalSort([...objectives])
        state.objectives = orderedObjectives;
        const orderedPhases = topologicalSort([...phases])
        state.phases = orderedPhases;
        state.selectedPhaseTabId = orderedPhases.length > 0 ? orderedPhases[0].id : ""
        state.selectedTreeItem = orderedPhases.length > 0 ? {...orderedPhases[0], type: "phase"} : null
      }

    },
    setSelectedTreeItem(state, action) {
      state.selectedTreeItem = action.payload;
    },
    setProcess(state, action) {
      state.process = action.payload;
      // state.network = generateGraph(state.process);
      // TODO: set tab depending on progress
      console.log("SETTING SELECTED TASK NULL")
      state.selectedTreeItem = null
    },
    updatePhase(state, action) {
      state.phases = state.phases.map(obj => obj.id === action.payload.id ? action.payload : obj);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload.id){
        state.selectedTreeItem = {...action.payload, type: "phase"}
      }
    },
    deletePhase(state, action) {
      state.phases = state.phases.filter(obj => obj.id !== action.payload);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload){
        state.selectedTreeItem = null
      }
    },
    updateObjective(state, action) {
      state.objectives = state.objectives.map(obj => obj.id === action.payload.id ? action.payload : obj);
      // updateDatesForObject(state, action.payload.phase_id, "phase", "objective")
      // updateProgressForObject(state, action.payload.phase_id, "phase", "objective")
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload.id){
        state.selectedTreeItem = {...action.payload, type: "objective"}
      }
    },
    deleteObjective(state, action) {
      state.objectives = state.objectives.filter(obj => obj.id !== action.payload);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload){
        state.selectedTreeItem = null
      }
    },
    updateTask(state, action) {
      state.tasks = state.tasks.map(obj => obj.id === action.payload.id ? action.payload : obj);
      // updateDatesForObject(state, action.payload.objective_id, "objective", "task")
      // updateProgressForObject(state, action.payload.objective_id, "objective", "task")
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload.id){
        state.selectedTreeItem = {...action.payload, type: "task"}
      }
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter(obj => obj.id !== action.payload);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload){
        state.selectedTreeItem = null
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUpdating(state, action) {
      state.updating = action.payload;
    },
    setUpdatingTree(state, action) {
      state.updatingTree = action.payload;
    },
    setSelectedPhase(state, action) {
      state.selectedPhaseTabId = action.payload;
      state.selectedTreeItem = {...state.phases.find(phase => phase.id === action.payload), type: "phase"}
    },
    setSoftwareInterlinkers(state, action) {
      state.softwareInterlinkers = action.payload;
    },
    setSoftwareInterlinkersLoading(state, action) {
      state.loadingSoftwareInterlinkers = action.payload;
    },
  }
});

export const { reducer } = slice;

export const setSelectedTreeItem = (data) => async (dispatch) => {
  dispatch(slice.actions.setSelectedTreeItem(data));
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

export const getSoftwareInterlinkers = () => async (dispatch) => {
  dispatch(slice.actions.setSoftwareInterlinkersLoading(true));
  const softwareinterlinkers = await softwareInterlinkersApi.getIntegrated()
  dispatch(slice.actions.setSoftwareInterlinkers(softwareinterlinkers));
  dispatch(slice.actions.setSoftwareInterlinkersLoading(false));
};

export const updateProcess = ({ id, data, logotype, onSuccess }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  let updatedData = await coproductionProcessesApi.update(id, data);
  if(logotype){
    await coproductionProcessesApi.setFile(id, "logotype", logotype)
    updatedData = await coproductionProcessesApi.get(id)
  }
  dispatch(slice.actions.setProcess(updatedData));
  dispatch(slice.actions.setUpdating(false));
  if (onSuccess) {
    onSuccess()
  }
};

export const updateTask = ({ id, data, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  const updatedData = await tasksApi.update(id, data)
  dispatch(slice.actions.updateTask(updatedData));
  // update parent objective
  const updatedObjectiveData = await objectivesApi.get(updatedData.objective_id)
  dispatch(slice.actions.updateObjective(updatedObjectiveData));
  // update parent phase
  const updatedPhaseData = await phasesApi.get(updatedObjectiveData.phase_id)
  dispatch(slice.actions.updatePhase(updatedPhaseData));
  dispatch(slice.actions.setUpdatingTree(false));
  if(callback){
    callback()
  }
};

export const updateObjective = ({ id, data, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  const updatedData = await objectivesApi.update(id, data)
  dispatch(slice.actions.updateObjective(updatedData));
  // update parent phase
  // const updatedPhaseData = await phasesApi.get(updatedData.phase_id)
  // dispatch(slice.actions.updatePhase(updatedPhaseData));
  dispatch(slice.actions.setUpdatingTree(false));
  if(callback){
    callback()
  }
};

export const updatePhase = ({ id, data, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  const updatedData = await phasesApi.update(id, data)
  dispatch(slice.actions.updatePhase(updatedData));
  dispatch(slice.actions.setUpdatingTree(false));
  if(callback){
    callback()
  }
};

export const deleteTask = ({ id, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  await tasksApi.delete(id)
  dispatch(slice.actions.deleteTask(id));
  dispatch(slice.actions.setUpdatingTree(false));
  if(callback){
    callback()
  }
};
export const deleteObjective = ({ id, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  await objectivesApi.delete(id)
  dispatch(slice.actions.deleteObjective(id));
  dispatch(slice.actions.setUpdatingTree(false));
  if(callback){
    callback()
  }
};
export const deletePhase = ({ id, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  await phasesApi.delete(id)
  dispatch(slice.actions.deletePhase(id));
  dispatch(slice.actions.setUpdatingTree(false));
  if(callback){
    callback()
  }
};

export const setselectedPhaseTabId = (data) => async (dispatch) => {
  dispatch(slice.actions.setSelectedPhase(data));
};

export default slice;
