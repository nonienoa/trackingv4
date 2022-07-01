import {
  DRIVER_LIST,
  TOGGLE_LOCATION,
  SPINNER_LOAD,
  MAP_VIEW,
  DEVICE_LIST,
  MAP_CHANGE,
  LOGGED_IN,
  LOGGED_OUT,
  SEARCHKEY,
  LOAD_PERMISSION,
  PASS_CURRENT_ZOOM
} from '../constants/actionTypes';
import center from '../constants/center';

const defaultState = {
  appName: 'Ek',
  viewChangeCounter: 0,
  isLoading: false,
  mapView: 'mapbox://styles/mapbox/streets-v10',
  isStreet: true,
  center: center(),
  isLoggedIn: false,
  zoom: 13,
  currentZoom: 13,
  searchkey: null,
  permissions: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case DRIVER_LIST:
      return {
        ...state,
        appLoaded: true,
        driverList: action.payload.drivers ? action.payload.drivers : null,
        deliveries: action.payload.deliveries ? action.payload.deliveries : null
      };
    case DEVICE_LIST:
      return {
        ...state,
        deviceList: action.payload
      };
   case TOGGLE_LOCATION:
      return {
        ...state,
        deliveries: action.payload ? action.payload : null
      };
    case SPINNER_LOAD:
      return {
        ...state,
        isLoading: !state.isLoading
      };
    case MAP_VIEW:
      return {
        ...state,
        isStreet: !state.isStreet,
        mapView: action.payload
      };
    case MAP_CHANGE:
      return {
        ...state,
        center: action.payload.center,
        zoom: action.payload.zoom

      };
    case LOGGED_IN:
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOGGED_OUT:
      return {
        ...state,
        isLoggedIn: false,
      };
    case SEARCHKEY:
      return  {
        ...state,
        searchkey: action.payload
      }
    case PASS_CURRENT_ZOOM:
        return {
          ...state,
          currentZoom: action.payload,
        }
    case LOAD_PERMISSION:
      return  {
        ...state,
        permissions: action.payload
      }
    default:
      return state;
  }
};