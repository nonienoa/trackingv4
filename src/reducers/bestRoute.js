import {
    CREATE_POLYGON, 
    DELETE_POLYGON, 
    ADD_POLYGON, 
    PRELOAD_POLYGON, 
    CUSTOM_POLYGON, 
    SUGGEST_POINT, 
    DELIVERY_POINT,
    TOTAL_DELIVERY,
    SUGGESTED_POINT,
    SELECTED_POLYGON,
    SELECTED_FIXED_POLYGON,
    ALREADY_SELECTED_POLYGON,
    ROUTE_DISPLAY,
    ROUTE_LIST,
    ROUTE_NUMBER,
    SUCCESS_MESSAGE,
    CUSTOM_AREA,
    RESET_ROUTE,
    SELECTED_START_POINT,
    SELECTED_STATION,
    SHOW_SELECTED_ROUTE,
    SELECTED_ROUTE,
    SHOW_DRIVERS,
    SHOW_DELIVERED_DRIVERS,
    SELECTED_FILTER,
    HIDE_DELIVERY,
    ROUTE_HISTORY,
    VAN_HISTORY,
    TOPOJSON
  } from '../constants/actionTypes';
  
  const defaultState = {
    createPolygon: false,
    deletePolygon: '',
    customAreaData: [],
    preloadPolygons: [],
    customPolygons: [],
    newPolygon:[],
    suggestPoint: false,
    deliveryPoints: [],
    allDeliveryPoints: [],
    suggestedPoints:{},
    selectedFixedPolygon:[],
    alreadySelectedPolygon:[],
    response:'',
    selectedStartPoint: {},
    selectedStation:'',
    selectedPolygon:{},
    totalRouteList:{},
    routeNumber:[],
    showSelectedRoute: false,
    selectedRoute: [],
    hideDrivers: true,
    hideDeliveredDrivers: true,
    hideDelivery: false,
    route: {},
    filterDay: '',
    filterShift: '',
    filterStation: '',
    vanNumber: '',
    totalRouteHistory: [],
    totalVanHistory: [],
    topoJson: {},
  };
  
  
  
  export default (state = defaultState, action) => {
    switch (action.type) {
      case CREATE_POLYGON:
        return {
          ...state,
          createPolygon: !state.createPolygon
        };
      case DELETE_POLYGON:
          return {
            ...state,
            deletePolygon: action.payload,
            newPolygon: []
          }
      case ADD_POLYGON: 
          return{
            ...state,
            newPolygon: action.payload,
          }
      case PRELOAD_POLYGON:
          return{
            ...state,
            preloadPolygons: action.payload
          }
      case CUSTOM_POLYGON:
        return{
          ...state,
          customPolygons: action.payload
        }
      case SUGGEST_POINT:
        return{
          ...state,
          suggestPoint: action.payload,
          selectedStartPoint: action.payload? state.selectedStartPoint:{},
          suggestedPoints: action.payload?state.suggestedPoints:{}
        }
      case DELIVERY_POINT:
        return {
          ...state,
          deliveryPoints: action.payload
        }
      case TOTAL_DELIVERY:
        return {
          ...state,
          allDeliveryPoints: action.payload
        }
      case SUGGESTED_POINT:
          return {
            ...state,
            suggestedPoints: action.payload
          }
      case SELECTED_POLYGON:
        return {
          ...state,
          selectedPolygon: action.payload
        }
      case SELECTED_FIXED_POLYGON:
        return {
          ...state,
          selectedFixedPolygon: action.payload
        }
      case ROUTE_DISPLAY:
          return {
            ...state,
            route: action.payload
          }
      case ROUTE_LIST:
        return {
          ...state,
          totalRouteList: action.payload
        }
      case SUCCESS_MESSAGE:
          return {
            ...state,
            response:action.payload
          }
      case CUSTOM_AREA:
          return {
            ...state,
            customAreaData: action.payload
          }
      case ROUTE_NUMBER:
        return {
          ...state,
          routeNumber: action.payload
        }
      case ALREADY_SELECTED_POLYGON:
          return {
            ...state,
            alreadySelectedPolygon: action.payload
          }
      case SELECTED_START_POINT:
          return {
            ...state,
            selectedStartPoint: action.payload
          }
      case SELECTED_STATION:
        return {
          ...state,
          selectedStation: action.payload.station?action.payload.station:'',
          vanNumber: action.payload.vanNumber
        }
      case SHOW_SELECTED_ROUTE:
          return {
            ...state,
            showSelectedRoute: action.payload
          }
      case SELECTED_ROUTE:
        return {
          ...state,
          selectedRoute: action.payload
        }
      case SHOW_DRIVERS:
        return {
          ...state,
          hideDrivers: action.payload
        }
      case SHOW_DELIVERED_DRIVERS:
        return {
          ...state,
          hideDeliveredDrivers: action.payload
        }
      case SELECTED_FILTER:
        return {
          ...state,
          filterDay: action.payload.selectedDay,
          filterShift: action.payload.selectedShift,
          filterStation: action.payload.selectedStation
        }
      case HIDE_DELIVERY:
        return {
          ...state,
          hideDelivery: action.payload
        }
      case ROUTE_HISTORY:
        return {
          ...state,
          totalRouteHistory: action.payload
        }
      case VAN_HISTORY:
        return {
          ...state,
          totalVanHistory: action.payload
        }
      case TOPOJSON: 
        return {
          ...state,
          topoJson: action.payload,
        }
      case RESET_ROUTE:
          return {
            ...state,
            createPolygon: false,
            deletePolygon: '',
            customAreaData: [],
            preloadPolygons: [],
            customPolygons: [],
            newPolygon:[],
            suggestPoint: false,
            deliveryPoints: [],
            allDeliveryPoints: [],
            suggestedPoints:{},
            selectedFixedPolygon:[],
            alreadySelectedPolygon:[],
            response:'',
            selectedPolygon:{},
            totalRouteList:{},
            routeNumber:[],
            route: {}
          }
      default:
        return state;
    }
  };