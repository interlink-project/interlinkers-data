import { combineReducers } from '@reduxjs/toolkit';
import { reducer as processReducer } from 'slices/process';
import { reducer as catalogueReducer } from 'slices/catalogue';

const rootReducer = combineReducers({process: processReducer, catalogue: catalogueReducer });

export default rootReducer;
