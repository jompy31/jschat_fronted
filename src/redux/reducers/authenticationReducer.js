// import { initialState } from '../store';
import { setAuthentication, clearAuthentication } from '../actions/authActions';

const initialState = {
    token: null,
    user: null,
  };

  const authenticationReducer = (state = initialState, action) => {
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

  export default authenticationReducer;
