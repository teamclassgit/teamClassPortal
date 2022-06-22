const initialState = {
  info: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'CONVERSATION_INFO':
    return {...state, info: action.payload};
  default:
    return state;
  }
};

export default reducer;
