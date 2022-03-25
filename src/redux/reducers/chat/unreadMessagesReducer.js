const initialState = {
  unreadMessages: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_UNREAD_MESSAGES':
    const { channelSid, unreadCount } = action.payload;
    return {...state, unreadMessages: {...state.unreadMessages, [channelSid]: unreadCount}};
  default:
    return state;
  }
};

export default reducer;
