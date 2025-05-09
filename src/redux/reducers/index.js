import { combineReducers } from 'redux';
import authenticationReducer from './authenticationReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  user: userReducer,
});

export default rootReducer;
