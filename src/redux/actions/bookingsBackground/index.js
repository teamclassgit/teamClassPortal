export const themeDark = (skin) => {
  return (dispatch) => {
    dispatch({
      type: "THEME_SKIN",
      payload: skin
    });
  };
};
