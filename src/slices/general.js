import { createSlice } from '@reduxjs/toolkit';
import { topologicalSort } from 'utils/comparePrerequisites';
import { coproductionProcessesApi, coproductionSchemasApi, softwareInterlinkersApi, teamsApi } from '../__api__';

const initialState = {
  softwareInterlinkers: [],
  loadingSoftwareInterlinkers: false,

  teams: [],
  loadingTeams: false,

  processes: [],
  loadingProcesses: false,

  schemas: [],
  loadingSchemas: false,
};

const slice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setTeams(state, action) {
      state.teams = action.payload
    },
    addTeam(state, action) {
      state.teams = [...state.teams, action.payload]
    },
    setLoadingTeams(state, action) {
      state.loadingTeams = action.payload
    },
    setProcesses(state, action) {
      state.processes = action.payload;
    },
    setLoadingProcesses(state, action) {
      state.loadingProcesses = action.payload
    },
    setSoftwareInterlinkers(state, action) {
      state.softwareInterlinkers = action.payload;
    },
    setSoftwareInterlinkersLoading(state, action) {
      state.loadingSoftwareInterlinkers = action.payload;
    },
    setSchemas(state, action) {
      state.schemas = action.payload
    },
    setLoadingSchemas(state, action) {
      state.loadingSchemas = action.payload
    },
  }
});

export const { reducer } = slice;

export const getSoftwareInterlinkers = () => async (dispatch) => {
  dispatch(slice.actions.setSoftwareInterlinkersLoading(true));
  const softwareinterlinkers = await softwareInterlinkersApi.getIntegrated()
  dispatch(slice.actions.setSoftwareInterlinkers(softwareinterlinkers));
  dispatch(slice.actions.setSoftwareInterlinkersLoading(false));
};

export const getMyTeams = () => async (dispatch) => {
  dispatch(slice.actions.setLoadingTeams(true));
  const teams_data = await teamsApi.getMine();
  dispatch(slice.actions.setTeams(teams_data));
  dispatch(slice.actions.setLoadingTeams(false));
};

export const addTeam = ({ data, callback }) => async (dispatch) => {
  dispatch(slice.actions.addTeam(data));
  if (callback) {
    callback()
  }
};

export const getMyProcesses = () => async (dispatch) => {
  dispatch(slice.actions.setLoadingProcesses(true));
  const processes_data = await coproductionProcessesApi.getMine();
  dispatch(slice.actions.setProcesses(processes_data));
  dispatch(slice.actions.setLoadingProcesses(false));
};

export const getSchemas = () => async (dispatch) => {
  dispatch(slice.actions.setLoadingSchemas(true));
  let schemas = await coproductionSchemasApi.getPublic();
  schemas = schemas.map(schema => {
    return { ...schema, phasemetadatas: topologicalSort(schema.phasemetadatas) }
  })
  dispatch(slice.actions.setSchemas(schemas));
  dispatch(slice.actions.setLoadingSchemas(false));
};

export default slice;
