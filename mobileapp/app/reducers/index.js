import { combineReducers } from 'redux';
import user from '../reducers/user';
import data from '../reducers/data';

const rootReducer = combineReducers({
  user,
  data,
});

export default rootReducer;
