import { createSlice } from '@reduxjs/toolkit';
import { coproductionProcessesApi, tasksApi, objectivesApi, phasesApi, assetsApi } from '../__fakeApi__';
import moment from "moment"
import generateGraph from 'pages/dashboard/coproductionprocesses/Tabs/Network/graph';

const initialState = {
  loading: false,
  updating: false,
  process: null,
  assets: [],
  tasks: [],
  objectives: [],
  phases: [],
  network: null,
  selectedPhaseTab: "",
  selectedTask: {
    assets: []
  },
};

const valid_obj_types = ["task", "objective", "phase"]

const updateDatesForObject = (obj, state, objType, childType) => {
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

const updateProgressForObject = (obj, state, objType, childType) => {
  if (obj && valid_obj_types.includes(objType) && valid_obj_types.includes(childType)) {
    let progress = 0
    let count = 0

    state[`${childType}s`].filter(el => el[`${objType}_id`] === obj.id).forEach(child => {
      progress += child.progress
      count += 1
    })

    const tot = Math.round(progress / count)
    obj.progress = tot
    return tot
  }
  console.error(obj, objType, childType)
  throw Error("Invalid object or objTypes");
}


function fnUpdateDatesOfPhase(state, id) {
  const phase = state.phases.find(el => el.id === id)
  updateDatesForObject(phase, state, "phase", "objective")
}
function fnUpdateProgressOfPhase(state, id) {
  const phase = state.phases.find(el => el.id === id)
  updateProgressForObject(phase, state, "phase", "objective")
}

const slice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setProcessTree(state, action) {
      const phases = []
      const objectives = []
      const tasks = []

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


      function compare(a, b) {
        if (a.prerequisites_ids.length === 0) {
          return -1
        }
        return !a.prerequisites_ids.includes(b.id) ? 1 : 0
      }

      const orderedPhases = [...phases].sort(compare)
      state.phases = orderedPhases;
      state.selectedPhaseTab = orderedPhases[0].name
    },
    setProcess(state, action) {
      state.process = action.payload;
      state.network = generateGraph(state.process);
    },
    setPhases(state, action) {
      state.phases = action.payload.data;
    },
    setObjectives(state, action) {
      state.objectives = action.payload.data;
    },
    setTasks(state, action) {
      state.tasks = action.payload.data;
    },
    updateDatesOfPhase(state, action) {
      fnUpdateDatesOfPhase(state, action.payload)
    },
    updateProgressOfPhase(state, action) {
      fnUpdateProgressOfPhase(state, action.payload)
    },
    updatePhase(state, action) {
      state.phases = state.phases.map(obj => obj.id === action.payload.id ? action.payload : obj);
    },
    updateObjective(state, action) {
      state.objectives = state.objectives.map(obj => obj.id === action.payload.id ? action.payload : obj);
    },
    updateTask(state, action) {
      state.tasks = state.tasks.map(obj => obj.id === action.payload.id ? action.payload : obj);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUpdating(state, action) {
      state.updating = action.payload;
    },
    setSelectedPhase(state, action) {
      state.selectedPhaseTab = action.payload;
    },
  }
});

export const { reducer } = slice;

export const getProcess = (processId) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  const [data, treeData] = await Promise.all([coproductionProcessesApi.get(processId), coproductionProcessesApi.getTree(processId)])
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
  dispatch(slice.actions.setUpdating(false));
};

export const updateObjective = ({ id, data }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  const updatedData = await objectivesApi.update(id, data)
  dispatch(slice.actions.updateObjective(updatedData));
  dispatch(slice.actions.updateDatesOfPhase(updatedData.phase_id));
  dispatch(slice.actions.updateProgressOfPhase(updatedData.phase_id));
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
