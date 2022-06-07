import { createSlice } from '@reduxjs/toolkit';
import { topologicalSort } from 'utils/topologicalSort';
import { coproductionProcessesApi, logsApi, objectivesApi, phasesApi, rolesApi, tasksApi } from '../__api__';

const initialState = {
  loading: false,
  updating: false,
  updatingTree: false,
  process: null,
  hasSchema: false,
  tree: [],
  treeitems: [],
  selectedPhaseTab: '',
  selectedTreeItem: null,
  roles: [],
  myRoles: [],
  teams: [],
  users: []
};

const getAllChildren = (children) => {
  if (!children){
    return []
  }    
  return children.reduce((prev, cur) => {
    if(cur && cur.children){
      return [...prev, cur, ...getAllChildren(cur.children)]
    }else{
      return prev
    }
  }, []);
}

const slice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setProcessTree(state, action) {
      state.hasSchema = action.payload.length > 0;
      if (action.payload) {
        // separate tree into groups
        state.tree = topologicalSort(action.payload)
        const all = getAllChildren(action.payload)
        const ordered = topologicalSort(all);
        state.treeitems = ordered;
        const found = ordered.find(el => el.type === "phase")
        state.selectedPhaseTab =  found;
        state.selectedTreeItem = found;
      }
    },
    setSelectedTreeItem(state, action) {
      state.selectedTreeItem = action.payload;
    },
    setMyRoles(state, action) {
      state.myRoles = action.payload;
    },
    setProcess(state, action) {
      state.process = action.payload;
      // TODO: set tab depending on progress
      state.selectedTreeItem = null;
    },
    setRoles(state, action) {
      state.roles = action.payload;
      state.teams = action.payload.reduce(
        (previousValue, currentValue) => [...previousValue, ...currentValue.teams.map((t) => ({ ...t, role_id: currentValue.id }))],
        []
      );
      state.users = action.payload.reduce(
        (previousValue, currentValue) => [...previousValue, ...currentValue.users.map((u) => ({ ...u, role_id: currentValue.id }))],
        []
      );
    },
    updatePhase(state, action) {
      
    },
    updateObjective(state, action) {
      
    },
    updateTask(state, action) {
    },
    updateTreeItem(state, action) {
      state.treeitems = state.treeitems.map((obj) => (obj.id === action.payload.id ? action.payload : obj));
      // updateDatesForObject(state, action.payload.objective_id, "objective", "task")
      // updateProgressForObject(state, action.payload.objective_id, "objective", "task")
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload.id) {
        state.selectedTreeItem = action.payload;
      }
    },
    /*
    deletePhase(state, action) {
      state.phases = state.phases.filter((obj) => obj.id !== action.payload);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload) {
        state.selectedTreeItem = null;
      }
    },
    deleteObjective(state, action) {
      state.objectives = state.objectives.filter((obj) => obj.id !== action.payload);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload) {
        state.selectedTreeItem = null;
      }
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter((obj) => obj.id !== action.payload);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload) {
        state.selectedTreeItem = null;
      }
    },
    */
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
      state.selectedPhaseTab = action.payload;
      state.selectedTreeItem = action.payload;
    },
  }
});

export const { reducer } = slice;

export const setSelectedTreeItem = (data, callback) => async (dispatch) => {
  dispatch(slice.actions.setSelectedTreeItem(data));
  callback && callback();
};

export const setProcess = (data) => async (dispatch) => {
  const treeData = await coproductionProcessesApi.getTree(data.id);
  dispatch(slice.actions.setProcess(data));
  dispatch(slice.actions.setProcessTree(treeData));
};

export const getProcess = (processId) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  const data = await coproductionProcessesApi.get(processId);
  const treeData = await coproductionProcessesApi.getTree(processId) || [];
  const myRoles = await coproductionProcessesApi.myRoles(processId) || [];
  dispatch(slice.actions.setProcess(data));
  dispatch(slice.actions.setProcessTree(treeData));
  dispatch(slice.actions.setMyRoles(myRoles));
  dispatch(slice.actions.setLoading(false));
};

export const setUpdatingTree = (val) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(val));
}


export const getTree = (processId, callback) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  const treeData = await coproductionProcessesApi.getTree(processId) || [];
  dispatch(slice.actions.setProcessTree(treeData));
  callback && callback()
  dispatch(slice.actions.setUpdatingTree(false));
};

export const getRoles = (processId) => async (dispatch) => {
  // dispatch(slice.actions.setUpdating(true));
  const data = await rolesApi.getMulti({
    coproductionprocess_id: processId
  });
  dispatch(slice.actions.setRoles(data));
  // dispatch(slice.actions.setUpdating(false));
};

export const updateProcess = ({ id, data, logotype, onSuccess }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  let updatedData = await coproductionProcessesApi.update(id, data);
  if (logotype) {
    await coproductionProcessesApi.setFile(id, 'logotype', logotype);
    updatedData = await coproductionProcessesApi.get(id);
  }
  dispatch(slice.actions.setProcess(updatedData));
  dispatch(slice.actions.setUpdating(false));
  if (onSuccess) {
    onSuccess();
  }
};

export const updateTask = ({ id, data, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  const updatedData = await tasksApi.update(id, data);
  dispatch(slice.actions.updateTask(updatedData));
  // update parent objective
  const updatedObjectiveData = await objectivesApi.get(updatedData.objective_id);
  dispatch(slice.actions.updateObjective(updatedObjectiveData));
  // update parent phase
  const updatedPhaseData = await phasesApi.get(updatedObjectiveData.phase_id);
  dispatch(slice.actions.updatePhase(updatedPhaseData));
  dispatch(slice.actions.setUpdatingTree(false));
  if (callback) {
    callback();
  }
};

export const updateObjective = ({ id, data, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  const updatedData = await objectivesApi.update(id, data);
  dispatch(slice.actions.updateObjective(updatedData));
  // update parent phase
  // const updatedPhaseData = await phasesApi.get(updatedData.phase_id)
  // dispatch(slice.actions.updatePhase(updatedPhaseData));
  dispatch(slice.actions.setUpdatingTree(false));
  if (callback) {
    callback();
  }
};

export const updatePhase = ({ id, data, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  const updatedData = await phasesApi.update(id, data);
  dispatch(slice.actions.updatePhase(updatedData));
  dispatch(slice.actions.setUpdatingTree(false));
  if (callback) {
    callback();
  }
};

/*
export const deleteTask = ({ id, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  await tasksApi.delete(id);
  dispatch(slice.actions.deleteTask(id));
  dispatch(slice.actions.setUpdatingTree(false));
  if (callback) {
    callback();
  }
};
export const deleteObjective = ({ id, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  await objectivesApi.delete(id);
  dispatch(slice.actions.deleteObjective(id));
  dispatch(slice.actions.setUpdatingTree(false));
  if (callback) {
    callback();
  }
};
export const deletePhase = ({ id, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  await phasesApi.delete(id);
  dispatch(slice.actions.deletePhase(id));
  dispatch(slice.actions.setUpdatingTree(false));
  if (callback) {
    callback();
  }
};
*/

export const setSelectedPhaseTab = (data) => async (dispatch) => {
  dispatch(slice.actions.setSelectedPhase(data));
};

export default slice;
