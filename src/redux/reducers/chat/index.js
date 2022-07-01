// @packages
import attachmentsReducer from './attachmentsReducer';
import convoReducer from './convoReducer';
import infoReducer from './infoReducer';
import lastReadIndexReducer from './lastReadIndexReducer';
import loadingReducer from './loadingReducer';
import messageReducer from './messageListReducer';
import notificationsReducer from './notificationsReducer';
import participantReducer from './participantsReducer';
import sidReducer from './currentConvoReducer';
import tokenReducer from './tokenReducer';
import totalUnreadCountReducer from './totalUnreadCountReducer';
import typingDataReducer from './typingDataReducer';
import unreadMessagesReducer from './unreadMessagesReducer';
import { combineReducers } from 'redux';

const reducers = (state, action) => {
  if (action.type === 'LOGOUT') {
    return appReducer(initialState, action);
  }

  return appReducer(state, action);
};

const appReducer = combineReducers({
  attachments: attachmentsReducer,
  information: infoReducer,
  convo: convoReducer,
  totalUnreadCount: totalUnreadCountReducer,
  lastReadIndex: lastReadIndexReducer,
  loadingStatus: loadingReducer,
  messages: messageReducer,
  notifications: notificationsReducer,
  participants: participantReducer,
  sid: sidReducer,
  token: tokenReducer,
  typingData: typingDataReducer,
  unreadMessages: unreadMessagesReducer
});

export default reducers;
