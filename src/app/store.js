import createRootReducer from './reducer';
import { createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';

export const history = createBrowserHistory();

export default function configureStore() {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    applyMiddleware(thunk),
  )
  return store
}

