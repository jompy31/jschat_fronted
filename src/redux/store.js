import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // 👈 Fix: Con llaves {}, es named export
import rootReducer from './reducers';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;