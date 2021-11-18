import { createSlice } from '@reduxjs/toolkit';
import { coproductionProcessesApi, phaseinstantiationsApi, objectiveinstantiationsApi, taskinstantiationsApi } from '../__fakeApi__';

const initialState = {
  loading: false,
  updating: false,
  process: null,
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

      const phaseinstantiations = []
      const objectiveinstantiations = []
      const taskinstantiations = []

      action.payload.treeData.forEach(phaseinstantiation => {
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
    setProcess2(state, action) {
      state.process = action.payload;
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
    setProgresses(state) {
      state.phaseinstantiations.forEach(phaseinstantiation => {
        let progress = 0
        let count = 0
        state.objectiveinstantiations.filter(el => el.phaseinstantiation_id === phaseinstantiation.id).forEach(objectiveinstantiation => {
          let progress2 = 0
          let count2 = 0
          state.taskinstantiations.filter(el => el.objectiveinstantiation_id === objectiveinstantiation.id).forEach(taskinstantiation => {
            progress2 += taskinstantiation.progress
            count2 += 1
          });
          const tot = Math.round(progress2 / count2)
          objectiveinstantiation.progress = tot
          progress += tot
          count += 1
        });
        phaseinstantiation.progress = Math.round(progress / count)
      });
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

/*
export const getProcess = (processId) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));

  const data = await coproductionProcessesApi.get(processId);
  dispatch(slice.actions.setProcess(data));
  
  const phaseinstantiations = await coproductionProcessesApi.getPhaseInstantiations(processId);
  dispatch(slice.actions.setPhaseInstantiations(phaseinstantiations));

  const objectiveinstantiations = []
  const taskinstantiations = []

  phaseinstantiations.forEach(async (phaseinstantiation) => {
    const res = await phaseinstantiationsApi.getObjectiveInstantiations(phaseinstantiation.id);
    res.forEach(async (objectiveinstantiation) => {
      const res2 = await objectiveinstantiationsApi.getTaskInstantiations(objectiveinstantiation.id);
      taskinstantiations.push.apply(taskinstantiations, res2)
    });
    objectiveinstantiations.push.apply(objectiveinstantiations, res)
  });
  
  dispatch(slice.actions.setObjectiveInstantiations(objectiveinstantiations));
  dispatch(slice.actions.setTaskInstantiations(taskinstantiations));

  dispatch(slice.actions.setLoading(false));
};
*/

export const updateTaskinstantiation = ({id, data}) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  const updatedData = await taskinstantiationsApi.update(id, data)
  dispatch(slice.actions.updateTaskinstantiation(updatedData));
  dispatch(slice.actions.setProgresses());
  dispatch(slice.actions.setUpdating(false));
};

export const setSelectedPhaseTab = (data) => async (dispatch) => {
  dispatch(slice.actions.setSelectedPhase(data));
};

export default slice;
