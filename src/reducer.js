
import { combineReducers } from 'redux';
import common from './reducers/common';
import info from './reducers/info';
import live from './reducers/live';
import geodata from './reducers/geodata';
import dashboard from './reducers/dashboard';
import bestRoute from './reducers/bestRoute';
import dropPoint from './reducers/dropPoint';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  common,
  info,
  live,
  geodata,
  dashboard,
  bestRoute,
  dropPoint,
  router: routerReducer
});