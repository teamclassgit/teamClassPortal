const initialState = {
  sid: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_CURRENT_CONVERSATION':
    return {...state, sid: action.sid};
  default:
    return state;
  }
};

export default reducer;