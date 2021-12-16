export const login = (token) => {
  return dispatch => {
    dispatch({
      type: 'LOGIN',
      payload: token
    });
  };
};

export const logout = () => {
  return dispatch => {
    dispatch({
      type: 'LOGOUT'
    });
  };
};

export const listConversations = (convos) => {
  return dispatch => {
    dispatch({
      type: 'LIST_CONVERSATIONS',
      payload: convos
    });
  };
};

export const updateCurrentConversation = (sid) => {
  return dispatch => {
    dispatch({
      type: 'UPDATE_CURRENT_CONVERSATION',
      payload: sid
    });
  };
};

export const setLastReadIndex = (index) => {
  return dispatch => {
    dispatch({
      type: 'CONVERSATION_LAST_READ_INDEX',
      payload: index
    });
  };
};

export const removeConversation = (sid) => {
  return dispatch => {
    dispatch({
      type: 'REMOVE_CONVERSATION',
      payload: sid
    });
  };
};

export const addMessages = (channelSid, messages) => {
  return dispatch => {
    dispatch({
      type: 'ADD_MESSAGES',
      payload: { channelSid, messages }
    });
  };
};

export const pushMessages = (channelSid, messages) => {
  return dispatch => {
    dispatch({
      type: 'PUSH_MESSAGES',
      payload: { channelSid, messages }
    });
  };
};

export const removeMessages = (channelSid, messages) => {
  return dispatch => {
    dispatch({
      type: 'REMOVE_MESSAGES',
      payload: { channelSid, messages }
    });
  };
};

export const updateLoadingState = (loadingStatus) => {
  return dispatch => {
    dispatch({
      type: 'UPDATE_LOADING_STATE',
      payload: loadingStatus
    });
  };
};

export const updateParticipants = (
  participants,
  sid
) => {
  return dispatch => {
    dispatch({
      type: 'UPDATE_PARTICIPANTS',
      payload: { participants, sid }
    });
  };
};

export const updateUnreadMessages = (
  channelSid,
  unreadCount
) => {
  return dispatch => {
    dispatch({
      type: 'UPDATE_UNREAD_MESSAGES',
      payload: { channelSid, unreadCount }
    });
  };
};

export const updateConversation = (
  channelSid,
  parameters
) => {
  return dispatch => {
    dispatch({
      type: 'UPDATE_CONVERSATION',
      payload: { channelSid, parameters }
    });
  };
};

export const addAttachment = (
  channelSid,
  messageIndex,
  attachment
) => {
  return dispatch => {
    dispatch({
      type: 'ADD_ATTACHMENT',
      payload: { channelSid, messageIndex, attachment }
    });
  };
};

export const startTyping = (channelSid, participant) => {
  return dispatch => {
    dispatch({
      type: 'TYPING_STARTED',
      payload: { channelSid, participant }
    });
  };
};

export const endTyping = (channelSid, participant) => {
  return dispatch => {
    dispatch({
      type: 'TYPING_ENDED',
      payload: { channelSid, participant }
    });
  };
};

export const addNotifications = (notifications) => {
  return dispatch => {
    dispatch({
      type: 'ADD_NOTIFICATIONS',
      payload: notifications
    });
  };
};

export const removeNotifications = (toIndex) => {
  return dispatch => {
    dispatch({
      type: 'REMOVE_NOTIFICATIONS',
      payload: toIndex
    });
  };
};
