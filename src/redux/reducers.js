import { combineReducers } from 'redux';
import authenticationReducer from './reducers/authenticationReducer';
import userReducer from './reducers/userReducer';

const initialState = {
    authentication: {
        token: null,
        user: null,
      },
    currentUser: null,
  };
  

const authReducer = (state = { token: null }, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'CLEAR_TOKEN':
      return { ...state, token: null };
    default:
      return state;
  }
};



const rootReducer = combineReducers({
  authentication: authenticationReducer,
  auth: authReducer,
  user: userReducer,
});


export default rootReducer;

