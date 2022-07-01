import {
  TRIPS,
  CHART,
  MOST_VISITED,
  MOST_SPENT,
  PERFORMANCE,
  TRIP_SELECTED_USER,
  TRIP_KM,
  DASHBOARD_ORDERS,
} from '../constants/actionTypes';

const defaultState = {
  trips: {},
  charts: [],
  mtsb: [],
  mvb: [],
  performace: [],
  tripSelectedUser: null,
  dashboardOrders: [],
  tripKM: 0
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case TRIPS:
      return {
        ...state,
        trips: action.payload ? action.payload.data : null
      };
    case CHART:
      return {
        ...state,
        charts: action.payload ? action.payload.data : null
      };
    case MOST_VISITED:
      return {
        ...state,
        mvb: action.payload ? action.payload.data : null
      };
    case MOST_SPENT:
      return {
        ...state,
        mtsb: action.payload ? action.payload.data : null
      };
    case PERFORMANCE:
      return {
        ...state,
        performace: action.payload ? action.payload.data : null
      };
    case TRIP_SELECTED_USER:
      return {
        ...state,
        tripSelectedUser: action.payload ? action.payload : null
      };
    case DASHBOARD_ORDERS:
      return {
        ...state,
        dashboardOrders: action.payload ? action.payload.data : null
      };

    case TRIP_KM:
      return {
        ...state,
        tripKM: action.payload ? action.payload : null
      };
    default:
      return state;
  }
};
