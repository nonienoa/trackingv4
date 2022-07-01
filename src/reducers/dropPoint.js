import {
  PICKUP_POINT,
  SELECT_PICKUP,
  SELECTED_ORDER,
  RESET_PICKUP,
  SELECTED_ORDER_POINT,
  DESTINATION_POINT,
  DROP_TAB,
  HOVERED_ORDER_POINT,
  SELECT_STATUS,
  CIRCLE_POSITION, SUGGESTED_DRIVER
} from '../constants/actionTypes';

const defaultState = {
  pickupPoints: [],
  selectedPickup: {},
  selectedOrders: [],
  selectedOrderPoint: {},
  hoveredOrderPoint: {},
  destinationPoints: [],
  suggestedDriver: [],
  dropTabName: 'both',
  selectedStatus: '',
  circlePosition: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case PICKUP_POINT:
      return {
        ...state,
        pickupPoints: action.payload
      };
    case SELECT_PICKUP:
      return {
        ...state,
        selectedPickup: action.payload
      };
    case SELECTED_ORDER:
      return {
        ...state,
        selectedOrders: action.payload
      }
    case SELECTED_ORDER_POINT:
      return {
        ...state,
        selectedOrderPoint: action.payload
      }
    case HOVERED_ORDER_POINT:
      return {
        ...state,
        hoveredOrderPoint: action.payload
      }
    case DESTINATION_POINT:
      return{
        ...state,
        destinationPoints: action.payload
      }
    case DROP_TAB:
      return {
        ...state,
        dropTabName: action.payload
      }
    case SELECT_STATUS:
      return {
        ...state,
        selectedStatus: action.payload
      }
    case CIRCLE_POSITION:
      return {
        ...state,
        circlePosition: action.payload
      }
    case SUGGESTED_DRIVER:
      return {
        ...state,
        suggestedDriver: action.payload
      }
    case RESET_PICKUP: 
      return {
        ...state,
        pickupPoints: [],
        selectedPickup: {},
        selectedOrders: [],
        selectedOrderPoint: {},
        hoveredOrderPoint: {},
        destinationPoints: [],
        dropTabName: 'both',
        selectedStatus: '',
        circlePosition: {},
        suggestedDriver: [],
      }
    default:
      return state;
  }
};