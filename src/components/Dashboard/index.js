import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import TopNav from '../TopNav';
import RoadChart from './RoadChart';
import Filter from './Filter';
import VanList from './VanList';
// import Spent from './Spent';
import Orders from './Orders';
// import Visited from './Visited';
import Performance from './Performance';
// import Trip from './Trip';
import agent from '../../agent';
// import TripsIcon from '../../assets/images/tripsmade_dashboard.svg';
// import Download from '../../assets/images/download1.svg';
// import KMIcon from '../../assets/images/km.svg';
// import OnRoadIcon from '../../assets/images/on_road.svg';
import { compact, isEmpty, pull, uniq } from 'lodash';
import moment from 'moment';
import {
  TRIPS,
  CHART,
  MOST_VISITED,
  MOST_SPENT,
  PERFORMANCE,
  TRIP_SELECTED_USER,
  DEVICE_LIST,
  TRIP_KM,
  DRIVER_LIST,
  LOCATION_NAV,
  DRIVER_NAV,
  DEVICE_NAV,
  SEARCHKEY,
  DASHBOARD_ORDERS,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.dashboard,
  activeList: state.live.activeList,
  gpsActiveList: state.live.gpsActiveList,
  driverList: state.common.driverList,
  deviceList : state.common.deviceList,
  mvb: state.dashboard.mvb,
  mtsb: state.dashboard.mtsb
});

const mapDispatchToProps = dispatch => ({
  onLoadTrips: (payload) =>
    dispatch({ type: TRIPS, payload}),
  onLoadCharts: (payload, t) =>
    dispatch({ type: CHART, payload , t}),
  onLoadMostVisited: (payload, t) =>
    dispatch({ type: MOST_VISITED, payload , t}),
  onLoadMostTimeSpent:  (payload, t) =>
    dispatch({ type: MOST_SPENT, payload , t}),
  onLoadPerformace: (payload, t) =>
    dispatch({ type: PERFORMANCE, payload}),
  setTripUser: (payload, t) =>
    dispatch({ type: TRIP_SELECTED_USER, payload}),
  onDeviceLoad: (payload, t) =>
    dispatch({ type: DEVICE_LIST, payload}),
  onLoad:(payload) => 
    dispatch({ type: DRIVER_LIST, payload }),
  onLoadKM: (payload, t) =>
    dispatch({ type: TRIP_KM, payload}),
  toggleUserNav: (payload) =>
    dispatch({ type: DRIVER_NAV, payload }),
  toggleLocationNav: (payload) =>
    dispatch({ type: LOCATION_NAV, payload }),
  toggleDeviceNav: (payload) =>
    dispatch({ type: DEVICE_NAV, payload }),
  passDashboardOrders: (payload)=>
    dispatch({ type: DASHBOARD_ORDERS, payload }),
  // selectedDriver: (payload) =>
  //   dispatch({ type: SELECTED_DRIVER, payload }),
  setSearchkey: (payload) =>
    dispatch({ type: SEARCHKEY, payload }),
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: moment(),
      endDate: moment(),
      userId: 352672100267616,
      totalUser : 0,
      totalActiveUser: 0,
      activePercentage: 0,
      tripsMade: 0,
      minsInRoad: 0,
      tripKM: 0,
      selectedMode: 'g',
      tripsTrack: [],
      assigned_no: 0,
      unassigned_no: 0,
      delivering_no: 0,
      delivered_no: 0,
      deliveringTime: 'N/A',
      assignedTime: 'N/A',
      filterDelivery: [],
      stationList: [],
      selectedWarehouse: {},
      selectedVan: {},
      totalOrders: [],
      selectedOrder: {},
      vanList: [],
    }

    this.download = this.download.bind(this)
  }

  async componentDidMount() {
    const { startDate, endDate } = this.state;
    let dashboardOrders = await agent.BestRoute.getDashboardOrders(startDate.format('YYYY-MM-DD'),endDate.format('YYYY-MM-DD'))
    let averageTime = await agent.BestRoute.averageTime('', startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    let stationList = await agent.BestRoute.getStation('','');
    this.props.passDashboardOrders(dashboardOrders.data);
    this.setState({
      filterDelivery: dashboardOrders.data,
      totalOrders: dashboardOrders.data,
      deliveringTime: averageTime.data? averageTime.data.avg_delivered_duration_time:'N/A',
      assignedTime: averageTime.data? averageTime.data.avg_order_ready_duration_time:'N/A',
      stationList: stationList.data.available,
    })
    this.calculateStats(dashboardOrders.data)
    this.sortStationList(stationList.data.available,dashboardOrders.data)
  }

  sortStationList = (station,orders) => {
    let sortStationList = station.map(d=>{
      d.orderNumber =  this.orderNumbers(d, orders);
      return d;
    })
    let finalSort = sortStationList.sort((a,b)=> b.orderNumber - a.orderNumber)
    this.setState({
      stationList: finalSort,
    })
  }

  sortVanList = (van, orders) => {
    let sortVanList = van.map(d=>{
      d.orderNumber = this.orderNumbersVan(d, orders);
      return d;
    })
    let finalSort = sortVanList.sort((a,b)=> b.orderNumber - a.orderNumber)
    this.setState({
      vanList: finalSort,
    })
  }

  calculateStats = (orders) => {
    let assigned= orders.map(del=>{
        if(del.order_status==="Ready for Delivery"){
            if(del.assign_vehicle){
                return 'Assigned'
            } else {
                return 'Unassigned'
            }
        } else if(del.order_status==="Delivering"){
                return "Delivering"
            }
        else if(del.order_status === "Delivered") {
                return 'Delivered'
            }
        else if(del.order_status === "Cancelled") {
                return 'Cancelled'
            }
        return null
    })
    this.setState({
        total_no: assigned.length,
        assigned_no: assigned.length - pull(assigned,'Assigned').length,
        unassigned_no: assigned.length - pull(assigned,'Unassigned').length,
        delivering_no: assigned.length - pull(assigned,'Delivering').length,
        delivered_no: assigned.length - pull(assigned,'Delivered').length,
    })
}

  componentDidUpdate(prevProps) {
    if(this.props !== prevProps) {
      const {trips} = this.props;
      if (trips) {
        this.setState({
          tripsMade: trips.total_trip,
          minsInRoad: trips.time_on_road,
          tripKM: trips.total_distance !== 0 ? (trips.total_distance * 0.001).toFixed(2) : 0
        });
      }
    }
  }

  tripsList = (data) => {
    if (data.length  !== this.state.tripsTrack.length) {
      this.setState({
        tripsTrack: data
      })
    }
  }

  handleEvent = async (event, picker) => {
    const { selectedMode, startDate, endDate } = this.state;
    this.setState({startDate: picker.startDate, endDate: picker.endDate});
    if(selectedMode === 'g'){
      let dashboardOrders = await agent.BestRoute.getDashboardOrders(picker.startDate.format('YYYY-MM-DD'),picker.endDate.format('YYYY-MM-DD'))
      let averageTime = await agent.BestRoute.averageTime(!isEmpty(this.state.selectedWarehouse)?this.state.selectedWarehouse.name:'', startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
      let stationList = await agent.BestRoute.getStation('','');
      this.props.passDashboardOrders(dashboardOrders.data);
      this.setState({
        filterDelivery: dashboardOrders.data,
        totalOrders: dashboardOrders.data,
        deliveringTime: averageTime.data? averageTime.data.avg_delivered_duration_time:'N/A',
        assignedTime: averageTime.data? averageTime.data.avg_order_ready_duration_time:'N/A',
        stationList: stationList.data.available,
      })
      this.calculateStats(dashboardOrders.data); 
      this.sortStationList(stationList.data.available,dashboardOrders.data)
    } else {
      let dashboardOrders = await agent.BestRoute.getDashboardOrders(picker.startDate.format('YYYY-MM-DD'),picker.endDate.format('YYYY-MM-DD'))
      // let averageTime = await agent.BestRoute.averageVehicleTime('', startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
      let vanList = await agent.BestRoute.vanList('','');
      this.props.passDashboardOrders(dashboardOrders.data);
      this.setState({
        filterDelivery: dashboardOrders.data,
        totalOrders: dashboardOrders.data,
        vanList: uniq(vanList.data),
      })
      this.calculateStats(dashboardOrders.data)
      this.sortVanList(uniq(vanList.data),dashboardOrders.data)
    }
    };


  userSearch = (event, {suggestion}) => {
    this.setState({userId: suggestion.id});
  }

  deviceChange = async e => {
    this.setState({
      selectedMode: e.target.value
    })
    const { startDate, endDate } = this.state;
    let dashboardOrders = await agent.BestRoute.getDashboardOrders(startDate.format('YYYY-MM-DD'),endDate.format('YYYY-MM-DD'))
    // let averageTime = await agent.BestRoute.averageVehicleTime('', startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    let vanList = await agent.BestRoute.vanList('','');
    this.props.passDashboardOrders(dashboardOrders.data);
    this.setState({
      filterDelivery: dashboardOrders.data,
      totalOrders: dashboardOrders.data,
      vanList: uniq(vanList.data),
    })
    this.calculateStats(dashboardOrders.data)
    this.sortVanList(uniq(vanList.data),dashboardOrders.data)
  }

  onWarehouseClick = async (d) => {
    const { startDate, endDate, selectedMode } = this.state;
    if(selectedMode === 'g'){
      if(d!==this.state.selectedWarehouse){
        let newOrders = this.state.totalOrders.map(order=>{ 
          if(order.warehouse===d.name){
            return order
          }
          return null;
        });
        let averageTime = await agent.BestRoute.averageTime(d.name, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        this.setState({
          selectedWarehouse: d,
          selectedOrder: {},
          filterDelivery: compact(newOrders),
          deliveringTime: averageTime.data? averageTime.data.avg_delivered_duration_time:'N/A',
          assignedTime: averageTime.data? averageTime.data.avg_order_ready_duration_time:'N/A',
        })
        this.calculateStats(compact(newOrders))
      } else {
        let averageTime = await agent.BestRoute.averageTime('', startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        this.setState({
          selectedWarehouse: {},
          selectedOrder: {},
          filterDelivery: this.state.totalOrders,
          deliveringTime: averageTime.data? averageTime.data.avg_delivered_duration_time:'N/A',
          assignedTime: averageTime.data? averageTime.data.avg_order_ready_duration_time:'N/A',
        })
        this.calculateStats(this.state.totalOrders)
      }
    }
  }

  onDriverClick = async (d) => {
    // const { startDate, endDate } = this.state;
      if(d!==this.state.selectedVan){
        let newOrders = this.state.totalOrders.map(order=>{
          if(order.assign_vehicle){
            if(order.assign_vehicle.split('(')[0]==d.name){
              return order
            }
          } 
          return null;
        });
        // let averageTime = await agent.BestRoute.averageTime(d.name, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        this.setState({
          selectedVan: d,
          selectedOrder: {},
          filterDelivery: compact(newOrders),
        })
        this.calculateStats(compact(newOrders))
      } else {
        // let averageTime = await agent.BestRoute.averageTime('', startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        this.setState({
          selectedVan: {},
          selectedOrder: {},
          filterDelivery: this.state.totalOrders,
        })
        this.calculateStats(this.state.totalOrders)
      }
  }

  handleOrderClick = (d) => {
    if(d!==this.state.selectedOrder){
      this.setState({
        selectedOrder: d,
      })
    } else {
      this.setState({
        selectedOrder: {},
      })
    }
  }

  orderNumbers(d, orders){
    let orderNumber = orders.map(order=>{ 
      if(order.warehouse===d.name){
        return order
      }
      return null;
    });
    return compact(orderNumber).length;
  }

  orderNumbersVan(d, orders){
    let orderNumber = orders.map(order=>{ 
      if((order.assign_vehicle?order.assign_vehicle.split('(')[0]: null)===d.name){
        return order
      }
      return null;
    });
    return compact(orderNumber).length;
  }

  download() {
    // let data = [];
    // let user = find(this.props.deviceList, ['internal_id', String(this.state.userId)]);

    // data[0]=[];
    // data[0].push('Device ID: ');
    // data[0].push(user !== undefined ? user.name : 'N/A');
    // data[0].push('');
    // data[0].push('');
    // data[0].push('Date');
    // data[0].push(this.state.startDate.format('YYYY-MM-DD'));

    // data[1]=[];
    // data[2]=[];
    // data[2].push("Trips Made: ");
    // data[2].push(this.state.tripsMade);
    // data[3]=[];
    // data[3].push("Run (Km): ");
    // data[3].push(this.state.tripKM);
    // data[4]=[];
    // data[4].push("Mins on Road: ");
    // data[4].push(this.state.minsInRoad);

    // data[5]=[];
    // data[6]=[];
    // data[6].push("Most Time Spent Area");

    // let counter = 7;

    // for(let d of this.props.most.mtsb) {
    //   data[counter] = [];
    //   data[counter].push(d.b_name);

    //   counter++;
    // }


    // data[counter]=[];
    // data[counter + 1]=[];
    // data[counter + 2]=[];
    // data[counter + 3] = [];
    // data[counter + 3].push("Most Visited Area");

    // counter = counter + 4;

    // for(let d of this.props.most.mvb) {
    //   data[counter] = [];
    //   data[counter].push(d.b_name);

    //   counter++;
    // }


    // if (this.state.tripsTrack.length !== 0 ) {
    //     data[counter]=[];
    //     data[counter +  1]=[];
    //     data[counter +  2]=[];
    //     data[counter +  3]=[];

    //     data[counter + 3].push("Trips");
    //     data[counter + 3].push("Km");

    //     counter = counter + 4;

    //     for(let d of this.state.tripsTrack) {
    //       if ((d.length >= 500 && d.name !== null) || d.name !== null) {
    //         data[counter] = [];
    //         data[counter].push(d.name || 'N/A');
    //         data[counter].push((d.length * 0.001).toFixed(2));

    //         counter++;
    //       }
    //     }

    // }


    // let csvContent = '';
    // let dataString;

    // for(let [index, content] of data.entries()) {
    //   dataString = content.join(",");
    //   csvContent += index < data.length ? dataString + "\n" : dataString;
    // }

    // window.URL = window.URL || window.webkitURL;
    // let link = document.createElement("a");
    // let myBlob = new Blob([csvContent], {type : "text/csv"});
    // let blobURL = window.URL.createObjectURL(myBlob);
    // link.href = blobURL;
    // link.download = 'info.csv';
    // link.click();
    // window.URL.revokeObjectURL(blobURL);
  }

  render() {
    const { assigned_no, unassigned_no, delivered_no, delivering_no, deliveringTime, assignedTime, selectedMode} = this.state;
    return (
      <div className="wrapper">
        <TopNav 
          toggleUserNav={this.props.toggleUserNav}
          toggleLocationNav={this.props.toggleLocationNav}
          toggleDeviceNav={this.props.toggleDeviceNav}
          driverNav={this.props.driverNav}
          deviceNav={this.props.deviceNav}
          locationNav={this.props.locationNav}
          driverList={this.props.driverList}
          selectedDriver={this.props.selectedDriver}
          history={this.props}
          setSearchkey={this.props.setSearchkey} 
        />
        <div className="dashboard-wrapper">
          <div className="bashboard-top-bar">
            <div className="d-flex justify-content-between dashtop__inner">
              <div className="dashboard-title">
                <h3>Delivery Dashboard</h3>
              </div>
              <div className="gps__dropdown">
              <select onChange={this.deviceChange}>
                <option value="g" >Order</option>
                <option value="m" >Vehicle</option>
              </select>
              </div>
              
              <Filter
                driverList={this.props.driverList}
                handleEvent={this.handleEvent}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                userId={this.state.userId}
                userSearch={this.userSearch}
                deviceList={this.props.deviceList}/>

            </div>
          </div>
          <div className="dashboard-left-content">
            <div className="row">
              <div className="col-md-3">
                {/* {this.props.trips &&
                  <Performance
                  performace={this.props.performace}
                  trips={this.props.trips}
                  driverList={this.props.driverList}
                  deviceList={this.props.deviceList}
                  setTripUser={this.setTripUser}
                  selectedDevice = {this.state.selectedDevice}
                  />} */}
                  {selectedMode==='g'?
                    <Performance 
                      stationList={this.state.stationList} 
                      onWarehouseClick={this.onWarehouseClick}
                      selectedWarehouse={this.state.selectedWarehouse}
                      orderNumbers={this.orderNumbers}
                      filterDelivery={this.state.totalOrders}
                    />
                    :
                    <VanList
                      vanList={this.state.vanList} 
                      onDriverClick={this.onDriverClick}
                      selectedVan={this.state.selectedVan}
                      orderNumbers={this.orderNumbersVan}
                      filterDelivery={this.state.totalOrders}
                    />}
              </div>
              <div className="col-md-9">
                <div className="head-block">
                  <div className="head-block-left">
                    <div className="row row-sm">
                    <div className="col-md-3">
                      <div className="tile primary-tile">
                        <div className="tile-img">
                          <img src='/images/icons/icon-unassigned.svg' alt="km-icon" />
                        </div>
                        <div className="tile-details">
                          <h3>{unassigned_no}</h3>
                          <p>Unassigned</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="tile info-tile">
                        <div className="tile-img">
                          <img src='/images/icons/icon-assigned.svg' alt="km-icon" />
                        </div>
                        <div className="tile-details">
                          <h3>{assigned_no}</h3>
                          <p>Assigned</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="tile warning-tile">
                        <div className="tile-img">
                          <img src='/images/icons/icon-delivering.svg' alt="km-icon" />
                        </div>
                        <div className="tile-details">
                          <h3>{delivering_no}</h3>
                          <p>Delivering</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="tile warning-tile">
                        <div className="tile-img">
                          <img src='/images/icons/icon-delivered.svg' alt="km-icon" />
                        </div>
                        <div className="tile-details">
                          <h3>{delivered_no}</h3>
                          <p>Delivered</p>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                  {/* <div className="head-block-right">
                    <div className="report-dv" onClick={this.download}>
                      <span>Download Report</span>
                      <i><img src={Download} alt="download" /></i>
                    </div>
                  </div> */}
                </div>
                  <div className="row row-sm">
                  <div className="col-md-6">
                    {/* {this.props.tripSelectedUser !== null  ? (
                      <Trip most={this.props.most} tripsList={this.tripsList} tripSelectedUser={this.props.tripSelectedUser} startDate={startDate} endDate={endDate} selectedDevice={this.state.selectedDevice}/>
                    ) : (
                      <Fragment>
                        {this.props.mtsb.length !== 0 && <Spent mtsb={this.props.mtsb}/>}
                      </Fragment>
                    )} */}
                  <Fragment>
                        {this.state.filterDelivery.length !== 0 && 
                          <Orders 
                            delivery={this.state.filterDelivery}
                            handleOrderClick={this.handleOrderClick}
                            selectedOrder={this.state.selectedOrder}
                          />
                        }
                  </Fragment>
                  </div>
                  { selectedMode==='g'? isEmpty(this.state.selectedOrder)?
                    <div className="col-md-6">
                      {/* {this.props.tripSelectedUser !== null && this.props.mvb.length !== 0 && <Visited mvb={this.props.mvb}/>}

                      {this.props.tripSelectedUser !== null && this.props.mtsb.length !== 0 && (
                        <Spent mtsb={this.props.mtsb}/>
                      )} */}
                      <div className="average-time">
                        <span>Average Unassigned time: {} min </span>
                      </div>
                      <div className="average-time">
                        <span>Average Assigned time: {assignedTime} min</span>
                      </div>
                      <div className="average-time">
                        <span>Average Delivering time: {deliveringTime} min </span>
                      </div>
                    </div>
                  :
                    <div className="col-md-6">
                      {/* {this.props.tripSelectedUser !== null && this.props.mvb.length !== 0 && <Visited mvb={this.props.mvb}/>}

                      {this.props.tripSelectedUser !== null && this.props.mtsb.length !== 0 && (
                        <Spent mtsb={this.props.mtsb}/>
                      )} */}
                        <div className="average-time">
                          <span>Order time: {moment(this.state.selectedOrder.order_date).format('DD MMM, YYYY')} ({moment(this.state.selectedOrder.order_time, 'HH:mm:ss').format('HH:mm')}) </span>
                        </div>
                        <div className="average-time">
                          <span>Scheduled time: {moment(this.state.selectedOrder.schedule_date).format('DD MMM, YYYY')} ({moment(this.state.selectedOrder.schedule_time, 'HH:mm:ss').format('HH:mm')})</span>
                        </div>
                        {this.state.selectedOrder.assign_vehicle?
                          <div className="average-time-driver">
                            <span>Driver: </span>
                            <div style={{ fontSize: '25px', fontWeight: 'bold', padding: '25px 0 0 50px' }}> {this.state.selectedOrder.assign_vehicle} </div>
                          </div>
                        : ''
                        }
                    </div>
                  :''}
                  <div className="col-md-12">
                    {this.props.charts? this.props.charts.length !==0 ? <RoadChart  charts={this.props.charts}/>:'':''}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);