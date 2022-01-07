import { createSlice } from '@reduxjs/toolkit';
import { interlinkersApi} from '../__fakeApi__';

const initialState = {
  loading: false,
  updating: false,
  interlinkers: [],
  status: {},
};


const slice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setInterlinkers(state, action) {
      state.interlinkers = action.payload.interlinkers;
      state.status = action.payload.status;
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

export const getInterlinkers = () => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  const [interlinkers, status] = await Promise.all([interlinkersApi.getMulti(), interlinkersApi.status()])
  dispatch(slice.actions.setInterlinkers({interlinkers, status }));
  dispatch(slice.actions.setLoading(false));
};

export default slice;
