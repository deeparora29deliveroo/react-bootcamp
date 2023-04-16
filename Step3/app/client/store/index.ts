import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import selectedValueReducer from '../reducer';

const composeEnhancers =
  // eslint-disable-next-line no-underscore-dangle
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsDenylist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);

const store = createStore(selectedValueReducer, enhancer);
export default store;
