const initialState = {
  chanelSid: [],
  messages: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'PUSH_MESSAGES': {
    return {...state, messages: [...state.messages, action.payload]};
  }
  case 'ADD_MESSAGES': {
    return {...state, messages: action.payload};
  }
  case 'REMOVE_MESSAGES': {
    return {...state, messages: action.payload};
  }
  default:
    return state;
  }
};

export default reducer;
