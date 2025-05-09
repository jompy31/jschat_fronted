const initialState = {
    user: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USERNAME':
        return { ...state, user: action.payload };
      case 'CLEAR_USERNAME':
        return { ...state, user: null };
      default:
        return state;
    }
  };
  
  export default userReducer;
  