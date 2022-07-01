// import agent from '../agent';
import React from 'react';
import { connect } from 'react-redux';
import TopNav from './TopNav';
import Map from './Map';
import Driver from './Driver';
// import Device from './Device';
import DropPoint from './DropPoint/';
import Info from './Info';
import Loader from 'react-loader-spinner';
import Timeline from './Info/Timeline';
import agent from '../agent';
import center from '../constants/center';
import {
  DRIVER_LIST,
  ACTIVE_DRIVER,
  ACTIVE_META,
  TIMELINE_INFO,
  SHOW_PATH,
  TRIP_PATH,
  SHOW_PINPOINT,
  SELECTED_DATE,
  DRIVER_TAB,
  LOCATION_TAB,
  LOCATION_NAV,
  DRIVER_NAV,
  DEVICE_LIST,
  DEVICE_NAV,
  GPS_PATH,
  SEARCHKEY,
  RESET_ROUTE,
  MAP_CHANGE
} from '../constants/actionTypes';
import { socket } from '../socket/feathers';

// const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.common,
  ...state.info,
  selectedDriver: state.info.selectedDriver,
  selectedDayField: state.info.selectedDayField,
  appName: state.common.appName,
});

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: DRIVER_LIST, payload }),
  onDeviceLoad: (payload) =>
    dispatch({ type: DEVICE_LIST, payload }),
  onActiveUser: (payload) =>
    dispatch({ type: ACTIVE_DRIVER, payload }),
  onActiveMeta: (payload) =>
    dispatch({ type: ACTIVE_META, payload }),
  toggleTimelineInfo: (payload) =>
    dispatch({ type: TIMELINE_INFO, payload }),
  setTripPath: (payload) =>
    dispatch({ type: SHOW_PATH, payload }),
  setPath: (payload) =>
    dispatch({ type: TRIP_PATH, payload }),
  pinPoint: (payload) =>
    dispatch({ type: SHOW_PINPOINT, payload }),
  selectedDateEvent: (payload) =>
    dispatch({ type: SELECTED_DATE, payload }),
  toggleUserTab: (payload) =>
    dispatch({ type: DRIVER_TAB, payload }),
  toggleLocationTab: (payload) =>
    dispatch({ type: LOCATION_TAB, payload }),
  toggleUserNav: (payload) =>
    dispatch({ type: DRIVER_NAV, payload }),
  toggleLocationNav: (payload) =>
    dispatch({ type: LOCATION_NAV, payload }),
  toggleDeviceNav: (payload) =>
    dispatch({ type: DEVICE_NAV, payload }),
  setGPSPath: (payload) =>
    dispatch({ type: GPS_PATH, payload }),
  // selectedDriver: (payload) =>
  //   dispatch({ type: SELECTED_DRIVER, payload }),
  setSearchkey: (payload) =>
    dispatch({ type: SEARCHKEY, payload }),
  resetRoute: () => 
    dispatch({ type: RESET_ROUTE }),
  changeMap: (payload) =>
    dispatch({ type: MAP_CHANGE, payload })
});

class Home extends React.Component {
  componentDidMount() {
    // this.props.onLoad( Promise.all([agent.Drivers.get()]));
    this.props.onDeviceLoad( Promise.all([agent.Drivers.getDevices()]));
    this.props.resetRoute()
    this.props.changeMap({
      center:center(),
      zoom: 13
  })
    //Fetch active users from socket
    socket.emit('fetch users');
    socket.emit('fetch metas');
    socket.on('active users', res => {
      this.props.onActiveUser(res);
    })
    socket.on('active metas', res => {
      this.props.onActiveMeta(res);
    })
  }

  componentWillUnmount() {
    this.props.toggleDeviceNav();
    // this.props.onUnload();
  }

  render() {
    const {
      isLoading,
      selectedDriver,
      toggleUserNav,
      toggleLocationNav,
      toggleDeviceNav,
      driverNav,
      locationNav,
      deviceNav,driverList,
      selectedDayField,
      timelineInfo,
      toggleTimelineInfo
    } = this.props;
    return (
      <div className="map-index">
        {this.props.isLoading && (
          <div className="loader">
          <Loader
            type="Oval"
            color="#926af2"
            height="50"
            width="50"
          />
          </div>
        )}

        <div className={`wrapper ${isLoading ? 'body-opacity' : ''}`}>
          <TopNav
            toggleUserNav={toggleUserNav}
            toggleLocationNav={toggleLocationNav}
            toggleDeviceNav={toggleDeviceNav}
            driverNav={driverNav}
            deviceNav={deviceNav}
            locationNav={locationNav}
            driverList={driverList}
            selectedDriver={selectedDriver}
            history={this.props}
            setSearchkey={this.props.setSearchkey}
            />
          <Map history={this.props.history}/>
          {driverNav && <Driver />}
          {/* {this.props.appLoaded !== undefined  && deviceNav && <Device />} */}
          {locationNav && <DropPoint />}
          <Info selectedDateEvent={this.props.selectedDateEvent}/>
          {selectedDriver &&
            <Timeline
              selectedDayField={selectedDayField}
              timelineInfo={timelineInfo}
              toggleTimelineInfo={toggleTimelineInfo}
              setTripPath={this.props.setTripPath}
              setGPSPath={this.props.setGPSPath}
              pinPoint={this.props.pinPoint}
              selectedDriver={selectedDriver}/>}

        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);