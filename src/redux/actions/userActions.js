export const setUsername = (username) => {
    return {
      type: 'SET_USERNAME',
      payload: username,
    };
  };
  
  export const clearUsername = () => {
    return {
      type: 'CLEAR_USERNAME',
    };
  };
  
  export const setCurrentUser = (currentUser) => {
    return {
      type: 'SET_CURRENT_USER',
      payload: currentUser,
    };
  };
  