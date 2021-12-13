const initialState = {
  convo: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'LIST_CONVERSATIONS':
    return {...state, convo: action.payload};
  case 'UPDATE_CURRENT_CONVERSATION':
    return { ...state, convo: action.payload };
  case 'REMOVE_CONVERSATION':
    return { ...state, convo: action.payload };
  default:
    return state;
  }
};

export default reducer;