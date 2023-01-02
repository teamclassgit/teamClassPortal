const reducer = (state = {}, action) => {
  switch (action.type) {
  case "UPDATE_PARTICIPANTS":
    const { participants, sid } = action.payload;
    return Object.assign({}, state, { [sid]: participants });
  default:
    return state;
  }
};

export default reducer;
