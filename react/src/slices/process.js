import { createSlice } from '@reduxjs/toolkit';
import { user_id } from 'contexts/CookieContext';
import { topologicalSort } from 'utils/topologicalSort';
import { coproductionProcessesApi } from '../__api__';

const initialState = {
  loading: true,
  updating: false,
  updatingTree: false,
  process: null,
  hasSchema: false,
  isAdministrator: false,
  tree: [],
  treeitems: [],
  selectedPhaseTab: '',
  selectedTreeItem: null,
  teams: [],
  users: []
};

export const getAllChildren = (children) => {
  if (!children) {
    return []
  }
  return children.reduce((prev, cur) => {
    if (cur) {
      if (cur.hasOwnProperty("children")) {
        return [...prev, cur, ...getAllChildren(cur.children)]
      } else {
        return [...prev, cur]
      }
    }
    return prev

  }, []);
}

export function cloneOrdered(obj, replaceId = null, replaceData = null) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = cloneOrdered(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    // if replacement of object needed
    if (replaceId && obj.hasOwnProperty("id") && obj.id === replaceId) {
      console.log("returning with replacedata", replaceData)
      return cloneOrdered(replaceData)
    } else {
      copy = {};
      for (var attr in obj) {
        if (attr === "children") {
          copy[attr] = cloneOrdered(topologicalSort(obj.children))
        }
        else if (obj.hasOwnProperty(attr)) copy[attr] = cloneOrdered(obj[attr]);
      }
      return copy;
    }

  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

const slice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setProcessTree(state, action) {
      state.hasSchema = action.payload.length > 0;
      if (action.payload) {
        state.tree = topologicalSort(cloneOrdered(action.payload))
        state.treeitems = getAllChildren(state.tree);
        if (action.payload.setFirstPhaseAsSelectedTreeItem) {
          const firstPhase = state.treeitems.find(el => el.type === "phase" && !el.is_disabled)
          state.selectedPhaseTab = firstPhase;
          state.selectedTreeItem = firstPhase;
        }
      }
    },
    setSelectedTreeItem(state, action) {
      state.selectedTreeItem = action.payload;
      state.selectedPhaseTab = action.payload.type === "phase" ? action.payload : state.treeitems.find(el => el.id === action.payload.phase_id);
    },
    setSelectedTreeItemById(state, action) {
      state.selectedTreeItem = state.treeitems.find(el => el.id === action.payload);
      state.selectedPhaseTab = state.selectedTreeItem.type === "phase" ? state.selectedTreeItem : state.treeitems.find(el => el.id === state.selectedTreeItem.phase_id);
    },
    setProcess(state, action) {
      state.process = action.payload;
      if (action.payload) {
        state.isAdministrator = action.payload.administrators_ids.includes(user_id)
      } else {
        // TODO: set tab depending on progress
        state.selectedPhaseTab = null;
        state.selectedTreeItem = null;
      }
    },
    updateTreeItem(state, action) {
      // separate tree into groups
      state.tree = topologicalSort(cloneOrdered(state.tree, action.payload.id, action.payload))
      state.treeitems = getAllChildren(state.tree);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload.id) {
        state.selectedTreeItem = action.payload;
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
  }
});

export const { reducer } = slice;


export const cleanProcess = () => async (dispatch) => {
  dispatch(slice.actions.setProcess(null));
};

export const getProcess = (processId, setLoading = true) => async (dispatch) => {
  if(setLoading) {dispatch(slice.actions.setLoading(true))}
  try {
    const data = await coproductionProcessesApi.get(processId);
    dispatch(slice.actions.setProcess(data));
    const treeData = await coproductionProcessesApi.getTree(processId) || [];
    treeData.setFirstPhaseAsSelectedTreeItem = true
    dispatch(slice.actions.setProcessTree(treeData));
  } catch (err) {
    // https://edupala.com/react-router-navigate-outside-component/
    console.error(err)
    // window.location.replace("/dashboard");
  }
  if(setLoading) {dispatch(slice.actions.setLoading(false))}

};

export const setUpdatingTree = (val) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(val));
}

export const getTree = (processId, selectedTreeItemId = null) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  const treeData = await coproductionProcessesApi.getTree(processId) || [];
  dispatch(slice.actions.setProcessTree(treeData));
  selectedTreeItemId && dispatch(slice.actions.setSelectedTreeItemById(selectedTreeItemId))
  dispatch(slice.actions.setUpdatingTree(false));
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

export const setSelectedTreeItem = (data, callback) => async (dispatch) => {
  dispatch(slice.actions.setSelectedTreeItem(data));
  callback && callback();
};

export const setSelectedTreeItemById = (data, callback) => async (dispatch) => {
  dispatch(slice.actions.setSelectedTreeItemById(data));
  callback && callback();
};

export default slice;
