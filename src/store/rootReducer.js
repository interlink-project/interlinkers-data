import { combineReducers } from '@reduxjs/toolkit';
import { reducer as processReducer } from '../slices/process';

const rootReducer = combineReducers({process: processReducer });

export default rootReducer;
