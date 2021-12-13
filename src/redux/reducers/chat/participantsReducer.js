const initialState = {
  participants: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_PARTICIPANTS':
    const { participants, sid } = action.payload;
    return {...state, participants: {...state.participants, [sid]: participants}};
  default:
    return state;
  }
};

export default reducer;
