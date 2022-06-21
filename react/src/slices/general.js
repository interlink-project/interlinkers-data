import { createSlice } from '@reduxjs/toolkit';
import { coproductionProcessesApi, organizationsApi, teamsApi } from '../__api__';

const initialState = {
  processes: [],
  loadingProcesses: true,

  schemas: [],
  loadingSchemas: false,

  organizations: [],
  loadingOrganizations: false,
};

const slice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setProcesses(state, action) {
      state.processes = action.payload;
    },
    setLoadingProcesses(state, action) {
      state.loadingProcesses = action.payload;
    },
    setOrganizations(state, action) {
      state.organizations = action.payload;
    },
    setLoadingOrganizations(state, action) {
      state.loadingOrganizations = action.payload;
    },
    setSchemas(state, action) {
      state.schemas = action.payload;
    },
    setLoadingSchemas(state, action) {
      state.loadingSchemas = action.payload;
    },
  }
});

export const { reducer } = slice;

export const getCoproductionProcesses = (search) => async (dispatch) => {
  dispatch(slice.actions.setLoadingProcesses(true));
  const processes_data = await coproductionProcessesApi.getMulti({search: search});
  dispatch(slice.actions.setProcesses(processes_data));
  dispatch(slice.actions.setLoadingProcesses(false));
};


export const getOrganizations = (search) => async (dispatch) => {
  dispatch(slice.actions.setLoadingOrganizations(true));
  const organizations_data = await organizationsApi.getMulti({search: search});
  dispatch(slice.actions.setOrganizations(organizations_data));
  dispatch(slice.actions.setLoadingOrganizations(false));
};

export default slice;
