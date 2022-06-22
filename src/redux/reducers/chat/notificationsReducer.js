const initialState = [];  

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'ADD_NOTIFICATIONS':
    return [...state, ...action.payload];
  case 'REMOVE_NOTIFICATIONS': {
    const removeCount = action.payload;
    if (removeCount + 1 > state.length) {
      return [];
    }
    return state.slice(removeCount, state.length);
  }
  default:
    return state;
  }
};

export default reducer;
