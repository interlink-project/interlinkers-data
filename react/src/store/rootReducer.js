import { combineReducers } from '@reduxjs/toolkit';
import { reducer as processReducer } from 'slices/process';
import { reducer as generalReducer } from 'slices/general';
import { reducer as teamReducer } from 'slices/team';

const rootReducer = combineReducers({process: processReducer, general: generalReducer, team: teamReducer});

export default rootReducer;
