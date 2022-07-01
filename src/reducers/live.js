import {
  ACTIVE_DRIVER,
  ACTIVE_META,
  GPS_ACTIVE_DRIVER
} from '../constants/actionTypes';

const defaultState = {
  activeList: [],
  activeMetas: [],
  gpsActiveList: []
};



export default (state = defaultState, action) => {
  switch (action.type) {
    case ACTIVE_DRIVER:
      return {
        ...state,
        activeList: action.payload ? action.payload : null
      };
    case GPS_ACTIVE_DRIVER:
      return {
        ...state,
        gpsActiveList: action.payload ? action.payload : null
      };
    case ACTIVE_META:
      return {
        ...state,
        activeMetas: action.payload ? action.payload : null
      };
    default:
      return state;
  }
};