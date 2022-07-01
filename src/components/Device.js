import React, {Component} from 'react';
import { connect } from 'react-redux';
import Search from '../assets/images/search.png';
import { filter, includes, find } from 'lodash';
import moment from 'moment';
import {
  SELECTED_DRIVER,
  TOGGLE_DRIVER,
  DRIVER_TAB,
  LOCATION_NAV,
  DRIVER_NAV
} from '../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.info,
  deviceList : state.common.deviceList,
  gpsdata: state.geodata.gpsdata,
  gpsActiveList: state.live.gpsActiveList
});

const mapDispatchToProps = dispatch => ({
  selectedDriver: (payload) =>
    dispatch({ type: SELECTED_DRIVER, payload }),
  toggleDriver: (payload) =>
    dispatch({type: TOGGLE_DRIVER, payload}),
  toggleDriverTab: (payload) =>
    dispatch({type: DRIVER_TAB, payload}),
  toggleUserNav: (payload) =>
    dispatch({ type: DRIVER_NAV, payload }),
  toggleLocationNav: (payload) =>
    dispatch({ type: LOCATION_NAV, payload }),
});

class Device extends Component {
  constructor (props) {
    super(props);

    this.state = {
      searchTerm: '',
      displayDevice: this.props.deviceList,
      checkAll: true
    }
    this.onInputChange =  this.onInputChange.bind(this);
    this.unSelectedDriver =  this.unSelectedDriver.bind(this);
  }

  onInputChange = (e) => {
    let searchRrivers = filter(this.props.deviceList, d => {
      return d.name.indexOf(e.target.value) !== -1
    })

    this.setState({
      searchTerm: e.target.value,
      displayDevice: searchRrivers
    })
  }

  unSelectedDriver = () => {
    this.setState({
      checkAll: !this.state.checkAll,
      displayDevice: this.state.displayDevice.map(d => {
        d.isChecked = !this.state.checkAll;
        return d;
      })
    })

    this.props.toggleDriver(this.state.displayDevice);
  }

  toggleDevice = (e) => {
    const driverIndex = this.props.deviceList.findIndex(obj => obj.internal_id === e.internal_id)
    this.props.deviceList[driverIndex].isChecked = !this.props.deviceList[driverIndex].isChecked;

    this.setState({
      displayDevice: this.props.deviceList
    })

    if (find(this.state.displayDevice, ['isChecked', false])) {
      this.setState({checkAll: false})
    } else {
      this.setState({checkAll: true})
    }

    this.props.toggleDriver(this.state.displayDevice);
  }

  getOrderCount = (d) => {
    let confirmCount = 0,
        deliveringCount = 0,
        deliveredCount = 0,
        cancelCount = 0

    for (let delivery of d.deliveries) {
      let status = delivery.status

      if (delivery['deliveryDate'] === moment().startOf('day').format('YYYY-MM-DD') || delivery['deliveryDate'] === null) {
        if (status && status.toLowerCase() === 'ready for delivery') {
          confirmCount++
        } else if (status.toLowerCase() === 'delivering') {
          deliveringCount++
        } else if (status && status.toLowerCase() === 'delivered') {
          deliveredCount++
        } else {
          cancelCount++
        }
      }
    }

    return (
      <div className="driver__delivers">
        <span className="confirm"> {confirmCount} </span>
        <span className="delivering"> {deliveringCount} </span>
        <span className="delivered"> {deliveredCount} </span>
        <span className="cancel"> {cancelCount} </span>
      </div>
    )
  }

  selectedUser = (d) => {
    const gpsdata = this.props.gpsdata;
    const getInfo = filter(gpsdata.data.features, ['properties.uniqueId', d["imei-number"]])[0];
    // const info = find(this.props.deviceList, ['ime_number', d.ime_number]);
    this.props.selectedDriver({
      firstName: d.name,
      lastName: '',
      type: 'gps',
      speed: getInfo ?  getInfo.properties.speed : 0,
      userId: d.imei_number,
      id: getInfo ? getInfo.properties.uniqueId : null,
      lastUpdate: getInfo ?  getInfo.properties.lastUpdate : null,
      lat: getInfo ?  getInfo.properties.latitude : 0,
      lng: getInfo ? getInfo.properties.longitude : 0,
      imageName: 'https://fmdelivery.koklass.com/backend/no-image.jpg',
      deviceId: getInfo ? getInfo.properties.deviceId : Number(d['imei-number']),
    });
  }

  render () {
    let {searchTerm, displayDevice, checkAll} = this.state;
    let {drivertab} = this.props;

    return (
      <div className={`drivers_sub box-shadow ${drivertab ? 'left-colapse' : ''}`}>
        <button type="button" className="slide-arrow" onClick={this.props.toggleDriverTab}>
          <i className={`fa ${drivertab ? 'fa-caret-left' : 'fa-caret-right'} `} aria-hidden="true"></i>
        </button>
        <div className="top-section">
          <div className="search-section">
            <img src={Search} alt="search" />
            <input type="text" className="form-control" placeholder="Search..." value={searchTerm} onChange={this.onInputChange} />
          </div>
        </div>

        <div className="drivers">
          <div className="check-all-section">
            <div className="list-drivers">
              <div className="custom_checkbox driver__checked">
                <input type="checkbox" id="checkbox-135" checked={checkAll} onChange={this.unSelectedDriver}/>
                <label htmlFor="checkbox-135" className="driver_name"> Select Drivers</label>
              </div>

              <ul>
                {
                  displayDevice.map(d => {
                    return (
                      <li key={d.id}>
                        <div className="custom_checkbox driver__checked">
                          <input type="checkbox" id={d.internal_id} checked={d.isChecked} onChange={this.toggleDevice.bind(this, d)} />
                          <label htmlFor={d.internal_id} className="driver_name" ></label>
                          <span className="driver__name" onClick={this.selectedUser.bind(this, d)}>
                            {d.name}
                          </span>
                          <i className={`fa fa-circle circle-status ${includes(this.props.gpsActiveList, d['imei-number']) ? 'avilable': ''}`} aria-hidden="true"></i>
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Device);