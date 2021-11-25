import { createSlice } from '@reduxjs/toolkit';
import { coproductionProcessesApi, taskinstantiationsApi, objectiveinstantiationsApi, phaseinstantiationsApi} from '../__fakeApi__';
import moment from "moment"
import generateGraph from 'pages/dashboard/processes/Tabs/Network/graph';

const initialState = {
  loading: false,
  updating: false,
  process: null,
  assets: [],
  taskinstantiations: [],
  objectiveinstantiations: [],
  phaseinstantiations: [],
  network: null,
  selectedPhaseTab: "engage"
};

const valid_obj_types = ["taskinstantiation", "objectiveinstantiation", "phaseinstantiation"]

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
  const phaseinstantiation = state.phaseinstantiations.find(el => el.id === id)
  updateDatesForObject(phaseinstantiation, state, "phaseinstantiation", "objectiveinstantiation")
}
function fnUpdateProgressOfPhase(state, id) {
  const phaseinstantiation = state.phaseinstantiations.find(el => el.id === id)
  updateProgressForObject(phaseinstantiation, state, "phaseinstantiation", "objectiveinstantiation")
}

const slice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setProcessTree(state, action) {

      const phaseinstantiations = []
      const objectiveinstantiations = []
      const taskinstantiations = []

      // separate tree into groups

      action.payload.forEach(phaseinstantiation => {
        phaseinstantiation.objectiveinstantiations.forEach(objectiveinstantiation => {
          objectiveinstantiation.taskinstantiations.forEach(taskinstantiation => {
            taskinstantiations.push(taskinstantiation)
          });
          objectiveinstantiations.push(objectiveinstantiation)
        });
        phaseinstantiations.push(phaseinstantiation)
      });
      state.taskinstantiations = taskinstantiations;
      state.objectiveinstantiations = objectiveinstantiations;
      state.phaseinstantiations = phaseinstantiations;
    },
    setProcess(state, action) {
      state.process = action.payload;
      state.network = generateGraph(state.process);
    },
    setPhaseInstantiations(state, action) {
      state.phaseinstantiations = action.payload.data;
    },
    setObjectiveInstantiations(state, action) {
      state.objectiveinstantiations = action.payload.data;
    },
    setTaskInstantiations(state, action) {
      state.taskinstantiations = action.payload.data;
    },
    updateDatesOfPhase(state, action) {
      fnUpdateDatesOfPhase(state, action.payload)
    },
    updateProgressOfPhase(state, action) {
      fnUpdateProgressOfPhase(state, action.payload)
    },
    updatePhaseInstantiation(state, action) {
      state.phaseinstantiations = state.phaseinstantiations.map(obj => obj.id === action.payload.id ? action.payload : obj);
    },
    updateObjectiveInstantiation(state, action) {
      state.objectiveinstantiations = state.objectiveinstantiations.map(obj => obj.id === action.payload.id ? action.payload : obj);
    },
    updateTaskInstantiation(state, action) {
      state.taskinstantiations = state.taskinstantiations.map(obj => obj.id === action.payload.id ? action.payload : obj);
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

export const updateProcess = ({id, data, onSuccess}) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  const updatedData = await coproductionProcessesApi.update(id, data);
  dispatch(slice.actions.setProcess(updatedData));
  dispatch(slice.actions.setUpdating(false));
  if(onSuccess){
    onSuccess()
  }
};

export const updateTaskInstantiation = ({ id, data }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  const updatedData = await taskinstantiationsApi.update(id, data)
  dispatch(slice.actions.updateTaskInstantiation(updatedData));
  dispatch(slice.actions.setUpdating(false));
};

export const updateObjectiveInstantiation = ({ id, data }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  const updatedData = await objectiveinstantiationsApi.update(id, data)
  dispatch(slice.actions.updateObjectiveInstantiation(updatedData));
  dispatch(slice.actions.updateDatesOfPhase(updatedData.phaseinstantiation_id));
  dispatch(slice.actions.updateProgressOfPhase(updatedData.phaseinstantiation_id));
  dispatch(slice.actions.setUpdating(false));
};

export const updatePhaseInstantiation = ({ id, data }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  const updatedData = await phaseinstantiationsApi.update(id, data)
  dispatch(slice.actions.updatePhaseInstantiation(updatedData));
  dispatch(slice.actions.setUpdating(false));
};

export const setSelectedPhaseTab = (data) => async (dispatch) => {
  dispatch(slice.actions.setSelectedPhase(data));
};

export default slice;
