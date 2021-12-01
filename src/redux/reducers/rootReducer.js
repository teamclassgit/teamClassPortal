// ** Redux Imports
import { combineReducers } from 'redux';

// ** Reducers Imports
import auth from './auth';
import navbar from './navbar';
import layout from './layout';
import chat from './chat';

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  chat
});

export default rootReducer;
