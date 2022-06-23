import { combineReducers } from '@reduxjs/toolkit';
import { reducer as processReducer } from 'slices/process';
import { reducer as generalReducer } from 'slices/general';

const rootReducer = combineReducers({ process: processReducer, general: generalReducer });

export default rootReducer;
