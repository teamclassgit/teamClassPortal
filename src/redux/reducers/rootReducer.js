// @packages
import { combineReducers } from 'redux';

// @scripts
import auth from './auth';
import navbar from './navbar';
import layout from './layout';
import reducer from './chat';
import bookingsBackground from './bookingsBackground';

const rootReducer = combineReducers({
  auth,
  bookingsBackground,
  layout,
  navbar,
  reducer
});

export default rootReducer;
