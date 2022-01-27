// ** Redux Imports
import { combineReducers } from 'redux';

// ** Reducers Imports
import auth from './auth';
import navbar from './navbar';
import layout from './layout';
import bookingsBackground from './bookingsBackground';

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  bookingsBackground
});

export default rootReducer;
