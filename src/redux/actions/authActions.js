export const setToken = (token) => {
    return {
      type: 'SET_TOKEN',
      payload: token,
    };
  };
  
  export const clearToken = () => {
    return {
      type: 'CLEAR_TOKEN',
    };
  };
  
  export const setAuthenticated = () => {
    return {
      type: 'SET_AUTHENTICATED',
    };
  };
  
  export const setUnauthenticated = () => {
    return {
      type: 'SET_UNAUTHENTICATED',
    };
  };
  
  export const setAuthentication = (token, user) => {
    return {
      type: 'SET_AUTHENTICATION',
      payload: {
        token,
        user,
      },
    };
  };
  
  export const clearAuthentication = () => {
    return {
      type: 'CLEAR_AUTHENTICATION',
    };
  };
  