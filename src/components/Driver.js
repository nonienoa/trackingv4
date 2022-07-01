import React, {Component} from 'react';
import { connect } from 'react-redux';
import Search from '../assets/images/search.png';
// import Bell from '../assets/images/bell.svg';
import Online from '../assets/images/online.svg';
import { filter, includes, sortBy, find } from 'lodash';
import Loader from '../assets/loader';
import {
  SELECTED_DRIVER,
  TOGGLE_DRIVER,
  DRIVER_TAB,
  LOCATION_NAV,
  DRIVER_NAV,
  MAP_CHANGE
} from '../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.info,
  driverList : state.common.driverList,
  activeList: state.live.activeList,
  geodata: state.geodata.geodata
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
  mapChange: (payload) =>
    dispatch({ type: MAP_CHANGE, payload }),
});

class Driver extends Component {
  constructor (props) {
    super(props);

    this.state = {
      searchTerm: '',
      displayDrivers: this.props.driverList,
      checkAll: true
    }
    this.onInputChange =  this.onInputChange.bind(this);
    this.unSelectedDriver =  this.unSelectedDriver.bind(this);
  }

  componentDidUpdate(prevProps){
    if(this.props.driverList!== prevProps.driverList) {
      this.setState({
        displayDrivers: this.props.driverList,
      })
    }
  }

  onInputChange = (e) => {
    let searchRrivers = filter(this.props.driverList, d => {
      return d.firstName.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    })

    this.setState({
      searchTerm: e.target.value,
      displayDrivers: searchRrivers
    })
  }

  unSelectedDriver = () => {
    this.setState({
      checkAll: !this.state.checkAll,
      displayDrivers: this.state.displayDrivers.map(d => {
        d.isChecked = !this.state.checkAll;
        return d;
      })
    })

    this.props.toggleDriver(this.state.displayDrivers);
  }

  toggleDrivers = (e) => {
    const driverIndex = this.props.driverList.findIndex(obj => obj.id === e.id)
    this.props.driverList[driverIndex].isChecked = !this.props.driverList[driverIndex].isChecked;

    this.setState({
      displayDrivers: this.props.driverList
    })

    if (find(this.state.displayDrivers, ['isChecked', false])) {
      this.setState({checkAll: false})
    } else {
      this.setState({checkAll: true})
    }

    this.props.toggleDriver(this.state.displayDrivers);
  }

  selectedUser = (d) => {
    const getInfo = filter(this.props.geodata.data.features, ['properties.userId', Number(d.id)]);

    if (getInfo.length !== 0) {
      this.props.mapChange({
        center: {
          lng:  getInfo[0].geometry.coordinates[0],
          lat: getInfo[0].geometry.coordinates[1]
        },
        zoom: 16
      })
    }

    this.props.selectedDriver(d);
  }

  render () {

    let {searchTerm, displayDrivers, checkAll} = this.state;
    let {activeList, drivertab} = this.props;
    activeList = activeList.map(Number);
    displayDrivers = sortBy(displayDrivers, ['firstName']);
    displayDrivers = displayDrivers.sort((a, b) =>  activeList.indexOf(Number(b.id)) - activeList.indexOf(Number(a.id)))

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
            <div className="driver__stats">
              <div className="driver__stat1">
                <p>
                  <span><img className="online_indicator" src={Online} alt="online" /></span>
                  Total Online (<span>{activeList.length}</span>/<span>{displayDrivers.length}</span>)</p>
              </div>
              <div className="driver__stat2">
                <p>SOS (<span>0</span>)</p>
              </div>
            </div>
              <div className="custom_checkbox driver__checked">
                <input type="checkbox" id="checkbox-135" checked={checkAll} onChange={this.unSelectedDriver}/>
                <label htmlFor="checkbox-135" className="driver_name"> Select Drivers</label>
              </div>

              <ul>
                {displayDrivers.length!==0?
                  displayDrivers.map(d => {
                    return (
                      <li key={d.id}>
                        <div className="custom_checkbox driver__checked">
                        {/*<img className="bell__icon" src={Bell} alt="bell" /> */}
                          <input type="checkbox" id={d.id} checked={d.isChecked} onChange={this.toggleDrivers.bind(this, d)} />
                          <label htmlFor={d.id} className="driver_name" ></label>
                          <span className="driver__name" onClick={this.selectedUser.bind(this, d)}>
                            {d.firstName} {d.lastName}
                          </span>
                          <i className={`fa fa-circle circle-status ${includes(this.props.activeList, String(d.id)) ? 'avilable': ''}`} aria-hidden="true"></i>
                           <div className="driver__delivers">
                             ({d.phone1})
                           </div>
                        </div>
                      </li>
                    )
                  })
                :<Loader />}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Driver);