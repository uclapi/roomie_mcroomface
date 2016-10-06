import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';

let store = null;

export const getStore = () => store;

export const configureStore = (callback) => {
  store = createStore(rootReducer, { }, compose(applyMiddleware(thunk, createLogger()), autoRehydrate()));

  persistStore(store, { whitelist: ['user'], storage: AsyncStorage }, () => {
    if (callback) callback(store);
  });
};
