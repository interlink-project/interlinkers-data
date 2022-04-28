import { createSlice } from '@reduxjs/toolkit';
import { teamsApi } from '../__api__';

const initialState = {
  loading: false,
  updating: false,
  team: {}
};

const slice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setTeam(state, action) {
      state.team = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUpdating(state, action) {
      state.updating = action.payload;
    },
  }
});

export const { reducer } = slice;

export const getTeam = (teamId) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  const data = await teamsApi.get(teamId)
  dispatch(slice.actions.setTeam(data));
  dispatch(slice.actions.setLoading(false));
};

export const updateTeam = ({ id, data, logotype, onSuccess }) => async (dispatch) => {
  dispatch(slice.actions.setUpdating(true));
  let updatedData = await teamsApi.update(id, data);
  if (logotype) {
    await teamsApi.setFile(id, "logotype", logotype)
    updatedData = await teamsApi.get(id)
  }
  dispatch(slice.actions.setTeam(updatedData));
  dispatch(slice.actions.setUpdating(false));
  if (onSuccess) {
    onSuccess()
  }
};

export default slice;
