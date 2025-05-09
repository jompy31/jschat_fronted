import { initialState } from '../store';

const authenticationReducer = (state = initialState.authentication, action) => {
    switch (action.type) {
      case 'SET_AUTHENTICATION':
        return {
          ...state,
          token: action.payload.token,
          user: action.payload.user,
        };
      case 'CLEAR_AUTHENTICATION':
        return {
          ...state,
          token: null,
          user: null,
        };
      default:
        return state;
    }
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