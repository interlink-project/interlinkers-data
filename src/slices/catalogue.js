import { createSlice } from '@reduxjs/toolkit';
import { interlinkersApi } from '../__fakeApi__';

const initialState = {
  loading: false,
  updating: false,
  interlinkers: [],
  websocket: null
};


const slice = createSlice({
  name: 'catalogue',
  initialState,
  reducers: {
    setInterlinkers(state, action) {
      state.interlinkers = action.payload;
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

export const getInterlinkers = (search, nature) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  // const [interlinkers, status] = await Promise.all([interlinkersApi.search(search, nature), interlinkersApi.status()])
  const interlinkers = await interlinkersApi.search(search, nature)
  dispatch(slice.actions.setInterlinkers(interlinkers));
  dispatch(slice.actions.setLoading(false));
};

export default slice;
