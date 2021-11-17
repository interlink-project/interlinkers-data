import { createSlice } from '@reduxjs/toolkit';
import { coproductionProcessesApi } from '../__fakeApi__';

const initialState = {
  loading: false,
  updating: false,
  process: null,
  tree: [],
  assets: [],
  taskinstantiations: [],
  objectiveinstantiations: [],
  phaseinstantiations: [],
  selectedPhaseTab: "engage"
};

const slice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setProcess(state, action) {
      state.process = action.payload.data;
      state.tree = action.payload.treeData;

      const phaseinstantiations = []
      const objectiveinstantiations = []
      const taskinstantiations = []

      state.phases = action.payload.treeData.forEach(phaseinstantiation => {
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
    updateTaskinstantiation(state, action) {
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
  const data = await coproductionProcessesApi.get(processId);
  const treeData = await coproductionProcessesApi.getTree(processId);
  dispatch(slice.actions.setProcess({ data, treeData }));
  dispatch(slice.actions.setLoading(false));
};

export const updateTaskinstantiation = (data) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  dispatch(slice.actions.updateTaskinstantiation(data));
  dispatch(slice.actions.setUpdating(false));
};

export const setSelectedPhaseTab = (data) => async (dispatch) => {
  dispatch(slice.actions.setSelectedPhase(data));
};

export default slice;
