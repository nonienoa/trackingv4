import {
  SELECTED_DRIVER,
  UNSELECTED_DRIVER,
  DEVICE_INFO,
  PATH_INFO,
  STAT_INFO,
  MESSAGE_INFO,
  TIMELINE_INFO,
  STATISTICS_INFO,
  DRIVER_STATISTICS,
  TOGGLE_DRIVER,
  TOGGLE_LOCATION,
  DRIVER_TAB,
  SELECTED_DATE,
  NODE_INFO,
  LOCATION_TAB,
  LOCATION_NAV,
  DRIVER_NAV,
  DEVICE_NAV,
  DEVICE_TAB
} from '../constants/actionTypes';
import moment from 'moment';

const defaultState = {
  selectedDriver: null,
  isSelected: false,
  deliveryInfo: false,
  deviceInfo: false,
  nodeInfo: false,
  messageInfo: false,
  showPathInfo: false,
  statInfo: false,
  statisticsInfo: true,
  timelineInfo: false,
  drivertab: true,
  locationtab: true,
  devicetab: true,
  driverNav: false,
  locationNav: true ,
  deviceNav: false ,
  selectedDayField: moment().format('YYYY-MM-DD')
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SELECTED_DRIVER:
      return {
        ...state,
        isSelected: true,
        selectedDriver: action.payload ? action.payload : null
      };
    case TOGGLE_DRIVER:
      return {
        ...state,
        selectedDriver: action.payload
      };
    case TOGGLE_LOCATION:
      return {
        ...state,
        selectedDriver: action.payload
      };
    case UNSELECTED_DRIVER:
      return {
        ...state,
        isSelected: false,
        selectedDriver: null,
        deviceInfo: false,
        showPathInfo: false,
        statInfo: false,
        timelineInfo: false,
        nodeInfo: false,
        messageInfo: false
      };
    case DEVICE_INFO:
      return {
        ...state,
        deviceInfo: !state.deviceInfo,
      };
    case PATH_INFO:
      return {
        ...state,
        showPathInfo: !state.showPathInfo,
        nodeInfo: false,
        messageInfo: false
      };
    case STAT_INFO:
      return {
        ...state,
        statInfo: !state.statInfo,
      };
    case STATISTICS_INFO:
      return {
        ...state,
        statisticsInfo: !state.statisticsInfo
      };
    case DRIVER_STATISTICS:
      return {
        ...state,
        driverStatistics: action.payload,
      };
    case MESSAGE_INFO:
      return {
        ...state,
        messageInfo: !state.messageInfo,
        nodeInfo: false,
        showPathInfo: false
      };
    case NODE_INFO:
      return {
        ...state,
        nodeInfo: !state.nodeInfo,
        messageInfo: false,
        showPathInfo: false
      };
    case TIMELINE_INFO:
      return {
        ...state,
        timelineInfo: !state.timelineInfo,
      };
    case DRIVER_TAB:
      return {
        ...state,
        drivertab: !state.drivertab
      };
    case DEVICE_TAB:
      return {
        ...state,
        devicetab: !state.devicetab
      };
    case LOCATION_TAB:
      return {
        ...state,
        locationtab: !state.locationtab
      };
    case DRIVER_NAV:
      return {
        ...state,
        driverNav: true,
        locationNav: false,
        deviceNav: false,
      };
    case DEVICE_NAV:
      return {
        ...state,
        deviceNav: true,
        driverNav: false,
        locationNav: false
      };
    case LOCATION_NAV:
      return {
        ...state,
        locationNav: true,
        driverNav: false,
        deviceNav: false,
      };
    case SELECTED_DATE:
      return {
        ...state,
        selectedDayField: action.payload ? action.payload : null
      };
    default:
      return state;
  }
};