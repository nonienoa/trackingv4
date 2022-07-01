import React from 'react';
import TopNav from '../TopNav';
import Map from '../Map';
import SideBar from './sideBar';
import Bottom from './bottom';
import ApiSuccess from './apiSucess';
import { 
  RESET_PICKUP, 
  MAP_CHANGE, 
  DRIVER_LIST, 
  LOCATION_NAV,
  DRIVER_NAV,
  DEVICE_NAV,
  GPS_PATH,
  SEARCHKEY, } from '../../constants/actionTypes';
// import agent from '../../agent'
import { connect } from 'react-redux';
import center from '../../constants/center';

const mapDispatchToProps  = dispatch => ({
  resetDropPoint: () => 
      dispatch({ type: RESET_PICKUP }),
  changeMap: (payload) => 
      dispatch({ type: MAP_CHANGE, payload }),
  onLoad: (payload) =>
      dispatch({ type: DRIVER_LIST, payload }),
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


})

class BestRoute extends React.Component {
    componentDidMount() {
        this.props.resetDropPoint()
        //  this.props.onLoad( Promise.all([agent.Drivers.get()]));
        this.props.changeMap({
            center:center(),
            zoom: 13
        })
    }
    render() {
        return(
            <div>
                <TopNav 
                  toggleUserNav={this.props.toggleUserNav}
                  toggleLocationNav={this.props.toggleLocationNav}
                  toggleDeviceNav={this.props.toggleDeviceNav}
                  driverNav={this.props.driverNav}
                  deviceNav={this.props.deviceNav}
                  locationNav={this.props.locationNav}
                  driverList={this.props.driverList}
                  selectedDriver={this.props.selectedDriver}
                  history = {this.props} 
                  setSearchkey={this.props.setSearchkey}
                />
                <Map 
                  history={this.props}
                />
                <SideBar />
                <Bottom />
                <ApiSuccess />
            </div>
        )
    }
}

export default connect(null,mapDispatchToProps)(BestRoute)