import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import selectedValueReducer from '../reducer';

const store = createStore(selectedValueReducer, applyMiddleware(thunk));
export default store;
