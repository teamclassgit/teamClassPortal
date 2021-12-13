import tokenReducer from "./tokenReducer";
import convoReducer from "./convoReducer";
import sidReducer from "./currentConvoReducer";
import messageReducer from "./messageListReducer";
import loadingReducer from "./loadingReducer";
import participantReducer from "./participantsReducer";
import unreadMessagesReducer from "./unreadMessagesReducer";
import attachmentsReducer from "./attachmentsReducer";
import typingDataReducer from "./typingDataReducer";
import lastReadIndexReducer from "./lastReadIndexReducer";
import notificationsReducer from "./notificationsReducer";
import chatReducer from "./chatReducer";

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
  token: tokenReducer,
  convo: convoReducer,
  sid: sidReducer,
  chats: chatReducer,
  contacts: chatReducer,
  selectedUser: chatReducer,
  userProfile: chatReducer,
  lastReadIndex: lastReadIndexReducer,
  messages: messageReducer,
  loadingStatus: loadingReducer,
  participants: participantReducer,
  unreadMessages: unreadMessagesReducer,
  attachments: attachmentsReducer,
  typingData: typingDataReducer,
  notifications: notificationsReducer
});

export default reducers;