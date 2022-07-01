import {
  ADD_GEOPOINT,
  ADD_GPSPOINT,
  SHOW_PATH,
  NODE_PATH,
  SHOW_PINPOINT,
  CLEAR_SHOW_PINPOINT,
  PROCESSED_PATH_INFO,
  TRIP_PATH,
  GPS_PATH,
  FOODMANDU_POINT,
  RESET_POINT,
  PINPOINT_CHANGE
} from '../constants/actionTypes';

const defaultState = {
  gpsPath: null,
  pathInfo: null,
  nodePath: null,
  tripPath: null,
  geodata: {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  },
  gpsdata: {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  },
  pinPoint: [],
  processedPathInfo: null,
  orderList: null,
  selectedPinPoint: null
};



export default (state = defaultState, action) => {
  switch (action.type) {
    case ADD_GEOPOINT:
      return {
        ...state,
        geodata: action.payload ? action.payload : null
      };
    case ADD_GPSPOINT:
      return {
        ...state,
        gpsdata: action.payload ? action.payload : null
      };
    case SHOW_PATH:
      return {
        ...state,
        nodePath: null,
        pinPoint: [],
        gpsPath:[],
        pathInfo: action.payload ? action.payload : null
      };
    case NODE_PATH:
      return {
        ...state,
        pathInfo: null,
        pinPoint: [],
        gpsPath:[],
        nodePath: action.payload ? action.payload : null
      };

      case GPS_PATH:
        return {
          ...state,
          nodePath: null,
          pathInfo: null,
          gpsPath: action.payload ? action.payload : null,
        };
    case TRIP_PATH:
      return {
        ...state,
        tripPath: action.payload ? action.payload : null
      };
    case SHOW_PINPOINT:
      return {
        ...state,
        pinPoint: action.payload ? action.payload : null
      };
    case PINPOINT_CHANGE:
      return {
        ...state,
        selectedPinPoint: action.payload ? action.payload : null
      };
    case CLEAR_SHOW_PINPOINT:
      return {
        ...state,
        pinPoint: [],
        pathInfo: null,
        gpsPath: null
      };
    case PROCESSED_PATH_INFO:
      return {
        ...state,
        processedPathInfo: action.payload ? action.payload : null
      };
    case FOODMANDU_POINT:
        return {
          ...state,
          orderList: action.payload.orderList
        };
    case RESET_POINT:
      return {
          ...state,
          orderList: null
        };

    default:
      return state;
  }
};