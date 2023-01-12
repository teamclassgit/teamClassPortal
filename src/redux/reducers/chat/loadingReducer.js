const initialState = {
  loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case "UPDATE_LOADING_STATE":
    return {...state, loading: action.payload};
  default:
    return state;
  }
};

export default reducer;
