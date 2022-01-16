const initialState = '';

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'THEME_SKIN':
    return action.payload;
  default:
    return state;
  }
};

export default reducer;
