const initialState = 0;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONVERSATION_TOTAL_UNREAD_MESSAGES_COUNT":
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
