// @packages
import attachmentsReducer from "./attachmentsReducer";
import chatReducer from "./chatReducer";
import convoReducer from "./convoReducer";
import lastReadIndexReducer from "./lastReadIndexReducer";
import loadingReducer from "./loadingReducer";
import messageReducer from "./messageListReducer";
import notificationsReducer from "./notificationsReducer";
import participantReducer from "./participantsReducer";
import sidReducer from "./currentConvoReducer";
import tokenReducer from "./tokenReducer";
import typingDataReducer from "./typingDataReducer";
import unreadMessagesReducer from "./unreadMessagesReducer";
import infoReducer from "./infoReducer";

import { combineReducers } from "redux";

const reducers = (state, action) => {
  if (action.type === 'LOGOUT') {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    return appReducer(initialState, action);
  }

  return appReducer(state, action);
};

const appReducer = combineReducers({
  attachments: attachmentsReducer,
  chats: chatReducer,
  contacts: chatReducer,
  information: infoReducer,
  convo: convoReducer,
  lastReadIndex: lastReadIndexReducer,
  loadingStatus: loadingReducer,
  messages: messageReducer,
  notifications: notificationsReducer,
  participants: participantReducer,
  selectedUser: chatReducer,
  sid: sidReducer,
  token: tokenReducer,
  typingData: typingDataReducer,
  unreadMessages: unreadMessagesReducer,
  userProfile: chatReducer
});

export default reducers;