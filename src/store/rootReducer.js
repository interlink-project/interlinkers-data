import { combineReducers } from '@reduxjs/toolkit';
import { reducer as processReducer } from '../slices/process';
import { reducer as chatReducer } from '../slices/chat';

const rootReducer = combineReducers({process: processReducer, chat: chatReducer });

export default rootReducer;
