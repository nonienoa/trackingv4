import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import agent from '../agent';
import {find} from 'lodash';

import { LOGGED_OUT, FOODMANDU_POINT, MAP_CHANGE, SHOW_DRIVERS, UNSELECTED_DRIVER, RESET_PICKUP, SHOW_DELIVERED_DRIVERS } from '../constants/actionTypes';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
  toggleLogin: () =>
    dispatch({ type: LOGGED_OUT }),
  changePoint:(payload) =>
    dispatch({ type: FOODMANDU_POINT, payload }),
  changeCenter: (payload) =>
    dispatch({ type: MAP_CHANGE, payload }),
  toggleDrivers: payload =>
    dispatch({ type: SHOW_DRIVERS, payload }),
  toggleDeliveredDrivers: payload =>
    dispatch({ type: SHOW_DELIVERED_DRIVERS, payload }),
  unSelectedUser: (payload) =>
    dispatch({ type: UNSELECTED_DRIVER, payload }),
  resetDropPoint: (payload) =>
    dispatch({ type: RESET_PICKUP, payload }),
})

const mapStateToProps = state => ({
  isLoggedIn: state.common.isLoggedIn,
  ...state.bestRoute,
  ...state.common
})

class TopNav extends Component {
  constructor (props) {
    super(props);

    this.state = {
      q: '',
      value:'',
      error: false,
      suggestions:[]
    }
    this.search =  this.search.bind(this);
    this.submit =  this.submit.bind(this);
  }

  async search() {
    const _this = this;
    let data = await agent.Drivers.searchOrder(this.state.q);

    if (data.order_id === 0) {
      this.setState({error: true})
      setTimeout(function() {
        _this.setState({error: false})
      }, 3000);
      return;
    }

    this.props.setSearchkey(data.order_id);
    if (data.DeliveryBoyId !==  0) {
      let user = find(this.props.driverList, ['id', String(data.DeliveryBoyId)]);
      this.props.selectedDriver(user);
    } else {
      data['customer_location'] = data.delivery_location;
      data['customer_name'] = data.full_name;
      data['customer_phone_number'] = data.phone_number;

      this.props.changePoint({
        orderList: [data]
      });
    }
  }

  handleLogout = () => {
    window.localStorage.setItem('isLoggedIn',false)
    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('token')
    this.props.history.history.push('/login')
  }

  async componentDidMount() {
    if(window.localStorage.getItem('isLoggedIn') === false) {
      this.props.history.history.push('/login')
    } else {
      if(!window.localStorage.getItem('token')){
        let token = await agent.BestRoute.getToken();
        window.localStorage.setItem('token', token.access_token)
      }
    }
  }


  submit = (e) => {
    if (e.keyCode === 13 && this.state.q !== '') {
      this.search();
    }
  }

  getSuggestions = async value => {
    const value1 = await agent.BestRoute.searchDeliveryPoint(value)
    return value1.data?value1.data:[]
  }

  getSuggestionValue = suggestion => suggestion.order_number

  onSuggestionsFetchRequested = async ( e ) => {
    e.persist()
    this.setState({
      suggestions: await this.getSuggestions(e.target.value),
      value: e.target.value
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  }

  userSearch = (suggestion) => {
    let data = {
      zoom: 18,
      center:{
        "lng": suggestion.geojson.coordinates[0],
        "lat": suggestion.geojson.coordinates[1]
      }
    }
    this.props.changeCenter(data)
  }

  toggleDrivers = (e) => {
    this.props.toggleDrivers(e.target.checked)
  }
  toggleDeliveredDrivers = (e) => {
    this.props.toggleDeliveredDrivers(e.target.checked)
  }

  render() {
    const { suggestions, value } = this.state;
    // const inputProps = {
    //   placeholder: 'Search Your Order',
    //   value,
    //   onChange: this.onChange
    // };
    return (
      <div className="topnav">
        <div className="d-flex justify-content-between" style={{height: '100%'}}>
          <div className="left-section">
            <NavLink to="/" className="brand_logo"  style={{width: '266px'}}>
              <button style={{border: 'none'}} onClick={()=>{
                  this.props.resetDropPoint();
                  this.props.toggleUserNav();
                }}>
                <span className="version">v0.0.3</span>
                <img src='/images/nav-logo.svg' alt="Logo" />
              </button>
            </NavLink>
            <NavLink to="/">
              <button className={`top__menu dirvers  ${this.props.driverNav ? 'btnActive' : ''}`} onClick={()=>{
                this.props.resetDropPoint();
                this.props.toggleUserNav();
              }}>
                <img src='/images/bus.svg' alt="User"/>
                <span>User</span>
              </button>
            </NavLink>


            {/* <button className={`top__menu ${this.props.deviceNav ? 'btnActive' : ''}`} onClick={this.props.toggleDeviceNav}>
              <img src={Devices} alt="DropPoint" height='21' width='18'/>
              <span>Devices</span>
            </button> */}
            <NavLink to="/">
              <button className={`top__menu ${this.props.locationNav ? 'btnActive' : ''}`} onClick={()=>{
                this.props.toggleLocationNav();
              }}>
                <img src='/images/marker.svg' alt="DropPoint" />
                <span>Drop Point</span>
              </button>
            </NavLink>
            {this.props.permissions.includes("Route")?
              <NavLink to="/route" className="top__menu" activeClassName="btnActive">
                <img src='/images/nav-route.svg' alt="Dashboard" />
                <span>Route</span>
              </NavLink> 
            :''
            }
            {this.props.permissions.includes("Forecast")?
              <NavLink to="/forecast" className="top__menu" activeClassName="btnActive">
                <img src='/images/icons/forecast.svg' alt="Forecast" />
                <span>Forecast</span>
              </NavLink> 
            :''
            }
            {this.props.permissions.includes("Dashboard")?
              <NavLink to="/dashboard" className="top__menu" activeClassName="btnActive">
                <img src='/images/dash.svg' alt="Dashboard" />
                <span>Dashboard</span>
              </NavLink>
            :''
            }

             {this.props.permissions.includes("List View")?
              <NavLink to="/list-view/1" className="top__menu" activeClassName="btnActive">
                <img src='/images/list-view.svg' alt="List-View" />
                <span>List View</span>
              </NavLink>
            :''
            }

            <button className="top__menu" onClick={this.handleLogout}>
              <img src='/images/logout.svg' alt="DropPoint" />
              <span>Logout</span>
            </button>
          </div>

          <div className="right-section">
              <div className="route-head-right">
                <div className="item-hd">
                      <div className="srch-head">
                          {this.props.history.history.location.pathname !=='/route'?
                            this.props.history.match.path !== '/list-view/:id' && this.props.history.match.path !== '/home'?
                            <input type="text" className="srch-control" placeholder="Search Your Order"/>
                            :''
                          :
                            <input type="text" className="srch-control" onChange={this.onSuggestionsFetchRequested} placeholder="Search Your Order"/>
                          }
                          <i className="fa fa-search" aria-hidden="true"></i>
                      </div>
                      { value !== ''? suggestions.length !==0 ?
                        <div style={{ position: "absolute", height:"250px", overflow:"scroll",backgroundColor: "#fff" }}>
                          { suggestions.map((suggestion, Key) =>
                            <div key={Key} style ={{ padding: "5px", borderBottom: "1px solid grey", cursor: "pointer" }} onClick={this.userSearch.bind(this,suggestion)}> {suggestion.order_number} </div>
                          ) }
                        </div>
                      :'':'' }
                  </div>
                  <div className="item-hd">
                      <button type="button" className="btn btn-hd"><img src='/images/icons/icon-checklist.svg' alt="checklist"/></button>
                  </div>
                <div className="item-hd">
                    <label className="hd-switch">
                        <input type="checkbox" onChange={this.toggleDrivers} checked={this.props.hideDrivers}/>
                        <span className="hd-slider round"></span>
                    </label>
                </div>
                <div className="item-hd">
                    <label className="hd-switch">
                        <input type="checkbox" onChange={this.toggleDeliveredDrivers} checked={this.props.hideDeliveredDrivers}/>
                        <span className="hd-delivered-slider round"></span>
                    </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
