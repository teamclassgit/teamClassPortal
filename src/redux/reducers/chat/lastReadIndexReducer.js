const initialState = {
  lastReadIndex: -1
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case "CONVERSATION_LAST_READ_INDEX":
    return {...state, lastReadIndex: action.payload};
  default:
    return state;
  }
};

export default reducer;
