import { createSlice } from '@reduxjs/toolkit';
import { topologicalSort } from 'utils/comparePrerequisites';
import { coproductionProcessesApi, objectivesApi, phasesApi, rolesApi, tasksApi } from '../__fakeApi__';
import { getSchemas } from "./general";

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
  roles: [],
  teams: []
};

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
        state.selectedTreeItem = orderedPhases.length > 0 ? { ...orderedPhases[0], type: "phase" } : null
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
    setRoles(state, action) {
      state.roles = action.payload;
      state.teams = action.payload.reduce(
        (previousValue, currentValue) => {
          return [...previousValue, ...currentValue.teams]
        },
        []
      );
    },
    updatePhase(state, action) {
      state.phases = state.phases.map(obj => obj.id === action.payload.id ? action.payload : obj);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload.id) {
        state.selectedTreeItem = { ...action.payload, type: "phase" }
      }
    },
    deletePhase(state, action) {
      state.phases = state.phases.filter(obj => obj.id !== action.payload);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload) {
        state.selectedTreeItem = null
      }
    },
    updateObjective(state, action) {
      state.objectives = state.objectives.map(obj => obj.id === action.payload.id ? action.payload : obj);
      // updateDatesForObject(state, action.payload.phase_id, "phase", "objective")
      // updateProgressForObject(state, action.payload.phase_id, "phase", "objective")
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload.id) {
        state.selectedTreeItem = { ...action.payload, type: "objective" }
      }
    },
    deleteObjective(state, action) {
      state.objectives = state.objectives.filter(obj => obj.id !== action.payload);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload) {
        state.selectedTreeItem = null
      }
    },
    updateTask(state, action) {
      state.tasks = state.tasks.map(obj => obj.id === action.payload.id ? action.payload : obj);
      // updateDatesForObject(state, action.payload.objective_id, "objective", "task")
      // updateProgressForObject(state, action.payload.objective_id, "objective", "task")
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload.id) {
        state.selectedTreeItem = { ...action.payload, type: "task" }
      }
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter(obj => obj.id !== action.payload);
      if (state.selectedTreeItem && state.selectedTreeItem.id === action.payload) {
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
      state.selectedTreeItem = { ...state.phases.find(phase => phase.id === action.payload), type: "phase" }
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
  const treeData = await coproductionProcessesApi.getTree(processId) || []
  if (treeData.length === 0) {
    dispatch(getSchemas())
  }
  dispatch(slice.actions.setProcess(data));
  dispatch(slice.actions.setProcessTree(treeData));
  dispatch(slice.actions.setLoading(false));
};

export const getRoles = (processId) => async (dispatch) => {
  // dispatch(slice.actions.setUpdating(true));
  const data = await rolesApi.getMulti({
    coproductionprocess_id: processId
  })
  dispatch(slice.actions.setRoles(data));
  // dispatch(slice.actions.setUpdating(false));
};

export const updateProcess = ({ id, data, logotype, onSuccess }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  let updatedData = await coproductionProcessesApi.update(id, data);
  if (logotype) {
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
  if (callback) {
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
  if (callback) {
    callback()
  }
};

export const updatePhase = ({ id, data, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  const updatedData = await phasesApi.update(id, data)
  dispatch(slice.actions.updatePhase(updatedData));
  dispatch(slice.actions.setUpdatingTree(false));
  if (callback) {
    callback()
  }
};

export const deleteTask = ({ id, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  await tasksApi.delete(id)
  dispatch(slice.actions.deleteTask(id));
  dispatch(slice.actions.setUpdatingTree(false));
  if (callback) {
    callback()
  }
};
export const deleteObjective = ({ id, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  await objectivesApi.delete(id)
  dispatch(slice.actions.deleteObjective(id));
  dispatch(slice.actions.setUpdatingTree(false));
  if (callback) {
    callback()
  }
};
export const deletePhase = ({ id, callback }) => async (dispatch) => {
  dispatch(slice.actions.setUpdatingTree(true));
  await phasesApi.delete(id)
  dispatch(slice.actions.deletePhase(id));
  dispatch(slice.actions.setUpdatingTree(false));
  if (callback) {
    callback()
  }
};

export const setselectedPhaseTabId = (data) => async (dispatch) => {
  dispatch(slice.actions.setSelectedPhase(data));
};

export default slice;
