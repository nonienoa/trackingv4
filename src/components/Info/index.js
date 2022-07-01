import React, {Component} from 'react';
import { connect } from 'react-redux';
import Driver from './Driver';
import Device from './Device';
import Stat from './Stat';
import Delivery from './Delivery';
import Statistics from './Statistics';
import {
  UNSELECTED_DRIVER,
  DEVICE_INFO,
  SHOW_PATH,
  PATH_INFO,
  STAT_INFO,
  TIMELINE_INFO,
  SPINNER_LOAD,
  CLEAR_SHOW_PINPOINT,
  PROCESSED_PATH_INFO,
  MESSAGE_INFO,
  NODE_PATH,
  NODE_INFO,
  FOODMANDU_POINT,
  RESET_POINT,
  PINPOINT_CHANGE,
  STATISTICS_INFO
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.info,
  ...state.live,
  ...state.geodata,
  searchkey:  state.common.searchkey
});

const mapDispatchToProps = dispatch => ({
  unSelectedUser: (payload) =>
    dispatch({ type: UNSELECTED_DRIVER, payload }),
  toggleDeviceInfo: (payload) =>
    dispatch({ type: DEVICE_INFO, payload }),
  togglePathInfo: (payload) =>
    dispatch({ type: PATH_INFO, payload }),
  showPath: (payload) =>
    dispatch({ type: SHOW_PATH, payload }),
  nodePath: (payload) =>
    dispatch({ type: NODE_PATH, payload }),
  toggleStatInfo: (payload) =>
    dispatch({ type: STAT_INFO, payload }),
  toggleStatisticsInfo: (payload) =>
    dispatch({ type: STATISTICS_INFO, payload }),
  messageStatInfo: (payload) =>
    dispatch({ type: MESSAGE_INFO, payload }),
  nodeStatInfo: (payload) =>
    dispatch({ type: NODE_INFO, payload }),
  toggleTimelineInfo: (payload) =>
    dispatch({ type: TIMELINE_INFO, payload }),
  toogleSpinner: (payload) =>
    dispatch({ type: SPINNER_LOAD, payload }),
  clearPinPoint: (payload) =>
    dispatch({ type: CLEAR_SHOW_PINPOINT, payload }),
  showProcessedPath:(payload) =>
    dispatch({ type: PROCESSED_PATH_INFO, payload }),
  changePoint:(payload) =>
    dispatch({ type: FOODMANDU_POINT, payload }),
  resetPoint:(payload) =>
    dispatch({ type: RESET_POINT, payload }),
  changePinPoint: (payload) =>
    dispatch({ type: PINPOINT_CHANGE, payload })
});

class Info extends Component {
  constructor() {
    super()
    this.state = {
      dateClicked: false
    }
  }

  openDate = () => {
    this.setState({
     dateClicked: true
    })
  }

  closeDate = msg => {
    this.setState({
      dateClicked: false
     })
  }

  render() {
    return (
      <div className={`right-sections ${(this.props.deviceInfo && this.props.statInfo) ? 'info-scroll': ''} ${this.props.isSelected ? 'right-colapse': ''} ${this.props.orderList !== null ? 'right-colapse' : ''} ${this.state.dateClicked ? "custom__minheight" : '' }`}>
        {this.props.isSelected &&
          <Driver
            selectedDriver={this.props.selectedDriver}
            activeList={this.props.activeList}
            unSelectedUser={this.props.unSelectedUser}
            toggleDeviceInfo={this.props.toggleDeviceInfo}
            togglePathInfo={this.props.togglePathInfo}
            deviceInfo={this.props.deviceInfo}
            messageInfo={this.props.messageInfo}
            showPathInfo={this.props.showPathInfo}
            showPath={this.props.showPath}
            nodePath={this.props.nodePath}
            statInfo={this.props.statInfo}
            toggleStatInfo={this.props.toggleStatInfo}
            timelineInfo={this.props.timelineInfo}
            toggleTimelineInfo={this.props.toggleTimelineInfo}
            toogleSpinner={this.props.toogleSpinner}
            toggleStatisticsInfo={this.props.toggleStatisticsInfo}
            clearPinPoint={this.props.clearPinPoint}
            selectedDateEvent={this.props.selectedDateEvent}
            showProcessedPath={this.props.showProcessedPath}
            messageStatInfo={this.props.messageStatInfo}
            nodeInfo={this.props.nodeInfo}
            nodeStatInfo={this.props.nodeStatInfo}
            gpsActiveList={this.props.gpsActiveList}
            changePoint={this.props.changePoint}
            resetPoint={this.props.resetPoint}
            changePinPoint={this.props.changePinPoint}
            geodata={this.props.geodata}
            openDate={this.openDate}
            closeDate={this.closeDate}
          />
        }
        {this.props.isSelected && this.props.statisticsInfo && (
          <Statistics selectedDriver={this.props.selectedDriver} />
        )}
        {this.props.isSelected && this.props.deviceInfo && (
          <Device
            activeList={this.props.activeList}
            selectedDriver={this.props.selectedDriver}
            deviceInfo={this.props.deviceInfo}
            toggleDeviceInfo={this.props.toggleDeviceInfo}
            geodata={this.props.geodata}
            activeMetas={this.props.activeMetas}/>
        )}

        {this.props.orderList !== null && (
          <Delivery
            orderList={this.props.orderList}
            timelineInfo={this.props.timelineInfo}
            resetPoint={this.props.resetPoint}
            searchkey={this.props.searchkey}
          />
        )}
        {this.props.isSelected && this.props.statInfo && (
          <Stat
            selectedDriver={this.props.selectedDriver}
            statInfo={this.props.statInfo}
            toggleStatInfo={this.props.toggleStatInfo}
            selectedDayField={this.props.selectedDayField}/>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);