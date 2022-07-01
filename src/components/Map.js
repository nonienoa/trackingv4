import React, {Component, createRef, Fragment} from 'react';
import {client}  from '../socket/feathers';
import { connect } from 'react-redux';
import moment from 'moment';
import { filter, findIndex, find, compact, includes, without, isEmpty } from 'lodash';
import { pointOnCircle } from '../utils/pointOnCircle';
import restClient from '../rest/feathers';
import agent from '../agent';
import {
  ADD_GEOPOINT,
  SELECTED_DRIVER,
  SPINNER_LOAD,
  ADD_GPSPOINT,
  GPS_ACTIVE_DRIVER,
  MAP_CHANGE,
  PINPOINT_CHANGE,
  DELETE_POLYGON,
  ADD_POLYGON,
  SUGGEST_POINT,
  SUGGESTED_POINT,
  SELECTED_POLYGON,
  SELECTED_FIXED_POLYGON,
  SELECT_PICKUP,
  SELECTED_ORDER,
  SELECTED_ORDER_POINT,
  PASS_CURRENT_ZOOM
} from '../constants/actionTypes';
import { Map as Leaflet, TileLayer, GeoJSON, Marker, Popup, CircleMarker, ZoomControl, Polygon, Circle} from 'react-leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import ReactDOMServer from 'react-dom/server';
import CustomPath from './CustomPath';
import Icon from './BestRoute/Icon';
import StartIcon from './DropPoint/StartIcon';
import L from 'leaflet';
import TopoJSON from '../libs/topoJson';
import 'react-leaflet-markercluster/dist/styles.min.css';


import markerUrl  from '../assets/images/confirmed.png';
// import DeliveredMarker from '../assets/images/delivered.png';
// import CancelMarker from '../assets/images/cancel.png';
// import DeliveringMarker from '../assets/images/delivering.png';
import Restaurant from '../assets/images/resturant.svg';
import Customer from '../assets/images/customer.svg';
import TodayNoShift from '../assets/images/Today-no-shift.svg';
import TodayEarlyMorning from '../assets/images/today-early-morning.svg';
import TodayMorning from '../assets/images/today-morning.svg';
import TodayAfternoon from '../assets/images/today-afternoon.svg';
import TodayEvening from '../assets/images/today-evening.svg';
import TomorrowNoShift from '../assets/images/Tomorrow-no-shift.svg';
import TomorrowEarlyMorning from '../assets/images/tomorrow-early-morning.svg';
import TomorrowMorning from '../assets/images/tomorrow-morning.svg';
import TomorrowAfternoon from '../assets/images/tomorrow-afternoon.svg';
import TomorrowEvening from '../assets/images/tomorrow-afternoon.svg';
import YesterdayNoShift from '../assets/images/Yesterday-no-shift.svg';
import YesterdayEarlyMorning from '../assets/images/Yesterday-early-morning.svg';
import YesterdayMorning from '../assets/images/Yesterday-morning.svg';
import YesterdayAfternoon from '../assets/images/Yesterday-afternoon.svg';
import YesterdayEvening from '../assets/images/Yesterday-evening.svg';
import Day1 from '../assets/images/green-point.svg';
import Day2 from '../assets/images/blue-point.svg';
import Day3 from '../assets/images/yellow-point.svg';
import Day4 from '../assets/images/red-point.svg';
import Station from '../assets/images/StationMark.svg';
import SelectedStation from '../assets/images/Start-point-selected-red.svg';
// import Pickup from '../assets/images/pickup-point.svg';
// import SelectPickup from '../assets/images/pickUpSelected.svg';
import Start from '../assets/images/end-point.svg';
import SelectedOrder from '../assets/images/selected-order.svg';
import availableDriver from '../assets/images/icons/availableDriver.svg';
import inactiveDriver from '../assets/images/icons/inActive.svg';
import assignedDriver from '../assets/images/icons/assignedDriver.svg';
import deliveringDriver from '../assets/images/icons/deliveringDriver.svg';
// import {assignedDriver, availableDriver, inactiveDriver, deliveringDriver} from '../constants/base64';

const AvailableDriver = L.icon({ iconUrl: availableDriver, iconSize:[32,32] })
const InactiveDriver = L.icon({ iconUrl: inactiveDriver, iconSize:[32,32] })
const AssignedDriver = L.icon({ iconUrl: assignedDriver, iconSize:[32,32] })
const DeliveringDriver = L.icon({ iconUrl: deliveringDriver, iconSize:[32,32] })
const DeliveredPoint = L.icon({ iconUrl: Start, iconSize:[32,32] })
const DeliveringPoint = L.icon({ iconUrl: Start, iconSize:[32,32] })
const CancelPoint = L.icon({ iconUrl: Start, iconSize:[32,32] })
const ConfirmPoint = L.icon({ iconUrl: Start, iconSize:[32,32] })
const RestaurantPoint = L.icon({ iconUrl: Restaurant, iconSize: [29, 32] })
const CustomerPoint = L.icon({ iconUrl: Customer, iconSize: [29, 32] })
const Day1Point = L.icon({ iconUrl: Day1, iconAnchor: [20,32], iconSize:[32,32] }) 
const Day2Point = L.icon({ iconUrl: Day2, iconAnchor: [20,32], iconSize:[32,32] }) 
const Day3Point = L.icon({ iconUrl: Day3, iconAnchor: [20,32], iconSize:[32,32] }) 
const Day4Point = L.icon({ iconUrl: Day4, iconAnchor: [20,32], iconSize:[32,32] }) 
const StationPoint = L.icon({ iconUrl: Station, iconSize:[32,32] })
const SelectedStationPoint = L.icon({ iconUrl: SelectedStation, iconSize:[32,32] })
// const PickupPoint = L.icon({ iconUrl: Pickup, iconSize:[32,32] })
// const SelectedPickupPoint = L.icon({ iconUrl: SelectPickup, iconSize:[40,40] })
// const StartPoint = L.icon({ iconUrl: Start, iconSize:[32,32] })
const SelectedOrderPoint = L.icon({ iconUrl: SelectedOrder,iconSize:[40, 40] })
const TodayNoShiftPoint = L.icon({ iconUrl: TodayNoShift,iconSize:[32,32] })
const TodayEarlyMorningPoint = L.icon({ iconUrl: TodayEarlyMorning,iconSize:[32,32] })
const TodayMorningPoint = L.icon({ iconUrl: TodayMorning,iconSize:[32,32] })
const TodayAfternoonPoint = L.icon({ iconUrl: TodayAfternoon,iconSize:[32,32] })
const TodayEveningPoint = L.icon({ iconUrl: TodayEvening,iconSize:[32,32] })
const TomorrowNoShiftPoint = L.icon({ iconUrl: TomorrowNoShift,iconSize:[32,32] })
const TomorrowEarlyMorningPoint = L.icon({ iconUrl: TomorrowEarlyMorning,iconSize:[32,32] })
const TomorrowMorningPoint = L.icon({ iconUrl: TomorrowMorning,iconSize:[32,32] })
const TomorrowAfternoonPoint = L.icon({ iconUrl: TomorrowAfternoon,iconSize:[32,32] })
const TomorrowEveningPoint = L.icon({ iconUrl: TomorrowEvening,iconSize:[32,32] })
const YesterdayNoShiftPoint = L.icon({ iconUrl: YesterdayNoShift,iconSize:[32,32] })
const YesterdayEarlyMorningPoint = L.icon({ iconUrl: YesterdayEarlyMorning,iconSize:[32,32] })
const YesterdayMorningPoint = L.icon({ iconUrl: YesterdayMorning,iconSize:[32,32] })
const YesterdayAfternoonPoint = L.icon({ iconUrl: YesterdayAfternoon,iconSize:[32,32] })
const YesterdayEveningPoint = L.icon({ iconUrl: YesterdayEvening,iconSize:[32,32] })

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerUrl,
    iconUrl: markerUrl,
    iconSize:     [28, 40],
    iconAnchor: [16,32]
});


const mapStateToProps = state => ({
  ...state.common,
  ...state.geodata,
  ...state.info,
  ...state.bestRoute,
  ...state.dropPoint,
  gpsActiveList: state.live.gpsActiveList
});

const mapDispatchToProps = dispatch => ({
  addGeoPoint: (payload) =>
    dispatch({ type: ADD_GEOPOINT, payload }),
  addGpsPoint: (payload) =>
    dispatch({ type: ADD_GPSPOINT, payload }),
  toggleSelectedDriver: (payload) =>
    dispatch({ type: SELECTED_DRIVER, payload }),
  toogleSpinner: (payload) =>
    dispatch({ type: SPINNER_LOAD, payload }),
  updateGpsActiveList: (payload) =>
    dispatch({ type: GPS_ACTIVE_DRIVER, payload }),
  changePosition: (payload) =>
    dispatch({ type: MAP_CHANGE, payload }),
  changePinPoint: (payload) =>
    dispatch({ type: PINPOINT_CHANGE, payload }),
  resetPolygon: () =>
    dispatch({ type: DELETE_POLYGON, payload:'' }),
  createNewPolygon: (payload) => 
    dispatch({ type: ADD_POLYGON, payload }),
  enableSuggestPoint: (payload) =>
    dispatch({ type: SUGGEST_POINT, payload }),
  selectPolygon: (payload) =>
    dispatch({ type:SELECTED_POLYGON, payload }),
  suggestedPoint: (payload) =>
    dispatch({ type: SUGGESTED_POINT, payload }),
  selectFixedPolygon: (payload) =>
    dispatch({ type: SELECTED_FIXED_POLYGON, payload }),
  selectPickup: (payload) =>
    dispatch({ type: SELECT_PICKUP, payload }),
  selectOrder: (payload) =>
    dispatch({ type: SELECTED_ORDER, payload }),
  selectOrderPoint: (payload) =>
    dispatch({ type: SELECTED_ORDER_POINT, payload }),
  setCurrentZoom: (payload) =>
    dispatch({ type: PASS_CURRENT_ZOOM, payload }),
});


class Map extends Component {
  mapRef = createRef()
  geoJsonLayer = createRef()
  // gpsJsonLayer = createRef()

  constructor(props) {
    super(props)

    this.animation =null;

    this.state = {
      localMap: null,
      geodata: this.props.geodata,
      gpsdata: this.props.gpsdata,
      center: [85.3240, 27.7172],
      zoom: [13],
      prevZoom: [13],
      selectedColor: null,
      pathInfoLatLng: null,
      mapView: this.props.mapView,
      pinDriver: null,
      routeNumber: [],
      antPathOptions: {
        use: L.polyline,
        color: '#0000FF',
        pulseColor: '#FFFFFF',
        weight: 5,
        delay: 8000,
        dashArray: [10, 20],
        hardwareAccelerated: true,
        reverse: true
      },
      positions: [],
      selectedFixedPolygon:[],
      selectedStatus: '',
      selectedMarker: AvailableDriver,
    }
  }

  componentDidMount() {
    client.service('geolocation').on('created', this.liveData.bind(this))
    // gpsClient.service('gpslocation').on('created', this.gpsData.bind(this));
    // this.gpsListiner();
    this.animation = window.requestAnimationFrame(this.animatePoint)
  }

  gpsListiner(){
    const websocket = new WebSocket('wss://gps.ekbana.info');
    websocket.onmessage = evt => this.gpsData(evt.data);
  }

  gpsData(gpsInfo) {
    gpsInfo['status'] = 'online';


    let payload = this.props.gpsdata;

    let detail =  find(this.props.deviceList, ['imei-number', gpsInfo.userId]);
    let filterData = filter(payload.data.features, ['properties.userId', gpsInfo.userId]);


    if (gpsInfo.status === 'online') {
      if (!includes(this.props.gpsActiveList, gpsInfo.userId)) {
        let udpdatedList = this.props.gpsActiveList;
        udpdatedList.push(gpsInfo.userId);
         this.props.updateGpsActiveList(udpdatedList);
      }
    } else {

      let udpdatedList = without(this.props.gpsActiveList, gpsInfo.userId);
      this.props.updateGpsActiveList(udpdatedList);
    }

    if (filterData.length === 0) {
      // propsPayload.data.features.push(pointOnCircle(data))
      if (detail !== undefined && detail.isChecked) {
        payload.data.features.push(pointOnCircle(gpsInfo));
      }
    } else {
      let geoIndex = findIndex(payload.data.features, filterData[0])
      payload.data.features[geoIndex] = pointOnCircle(gpsInfo);

      if (detail !== undefined && !detail.isChecked) {
        delete payload.data.features[geoIndex]
        payload.data.features = compact(payload.data.features);
      }
    }

    this.props.addGpsPoint(payload);
  }

  componentWillUnmount() {
    delete this.geoJsonLayer;
    // delete this.gpsJsonLayer;
    clearTimeout(this.animationTimeout)
    window.cancelAnimationFrame(this.animatePoint)
  }

  liveData = (data) => {
    let payload = this.props.geodata;
    // let propsPayload = cloneDeep(this.props.geodata);
    let detail =  find(this.props.driverList, ['id', String(data.userId)]);
    let filterMapData = payload.data.features.map(prop => {
      if(String(prop.properties.userId)===String(data.userId)){
        return prop
      }
      return null;
    })
    // let filterData = filter(payload.data.features, ['properties.userId', data.userId])
    let filterData = compact(filterMapData)
    if (this.props.selectedDriver !== null ) {
      if (String(data.userId) === this.props.selectedDriver.id) {
        this.props.changePinPoint({
          lat: data.lat,
          lng: data.lng
        })
      }
    }

    if (filterData.length === 0) {
      // propsPayload.data.features.push(pointOnCircle(data))
      if (detail !== undefined) {
        payload.data.features.push(pointOnCircle(data))
      }
    } else {
      let geoIndex = findIndex(payload.data.features, filterData[0])
      payload.data.features[geoIndex] = pointOnCircle(data);

      if (detail !== undefined && !detail.isChecked) {
        delete payload.data.features[geoIndex]
        payload.data.features = compact(payload.data.features);
      }
    }

    this.props.addGeoPoint(payload);
  }

  async componentDidUpdate(prevProps) {  
    if(this.props !== prevProps) {
      let props = this.props;
      if (props.selectedDriver !== null) {
       let locateUser = filter(props.geodata.data.features, ['properties.userId', Number(props.selectedDriver.id)])
        
        if (locateUser.length !== 0) {
          if (this.state.selectedColor === null) {
            let color = '#328BD8';
  
            if (locateUser[0].properties.meta.hasOwnProperty('st') && locateUser[0].properties.meta.st.length === 0) {
              if (props.selectedDriver.IsCheckedIn) {
                color = '#28B200';
              } else {
                color = '#328BD8';
              }
  
            } else if (locateUser[0].properties.meta.hasOwnProperty('st') &&
              locateUser[0].properties.meta.st.length === 1) {
  
                if (locateUser[0].properties.meta.st.includes('3')) {
                  color = '#F28406';
                } else {
                  color = '#F62D2D';
                }
            } else if (locateUser[0].properties.meta.hasOwnProperty('st') &&
              locateUser[0].properties.meta.st.length > 1 ) {
  
                if (locateUser[0].properties.meta.st.includes('0') ||
                    locateUser[0].properties.meta.st.includes('1') ||
                    locateUser[0].properties.meta.st.includes('2')) {
                  color = '#F62D2D';
                } else {
                  color = '#F28406';
                }
            }
  
            this.setState({selectedColor: color})
          }
  
          if (this.props.selectedPinPoint === null) {
            let latlng = {
              lat: locateUser[0].geometry.coordinates[1],
              lng: locateUser[0].geometry.coordinates[0]
            }
            let marker = AvailableDriver;
            let ts = locateUser[0].properties.ts;
            var date = moment(ts);
            var now = moment();
            var msInMinutes = now.diff(date, 'minutes');
            if(msInMinutes>10){
              marker = InactiveDriver;
            }
            if(locateUser[0].properties.meta.st===1){
              marker = AvailableDriver;
            }
            if(locateUser[0].properties.meta.st===2){
              marker = AssignedDriver;
            }
            if(locateUser[0].properties.meta.st===3){
              marker = DeliveringDriver;
            }
            this.props.changePinPoint(latlng);
            this.setState({
              selectedMarker: marker,
            })
          }
  
        }
  
      } else {
        this.setState({selectedColor: null})
      }
      if(this.props.deletePolygon !== '') {
        this.setState({
          positions: [],
        })
        this.props.resetPolygon()
      }
      if(this.props.routeNumber !== prevProps.routeNumber) {
        this.setState({
          routeNumber:[]
        })
        window.setTimeout(() => {
          this.setState({
            routeNumber: this.props.routeNumber
          })
        },200)
      }
      if(this.props.selectedStatus !== prevProps.selectedStatus){
        this.setState({
          selectedStatus: this.props.selectedStatus
        })
      }
      if(this.props.driverList !== prevProps.driverList){
        let offlineUser = await agent.NearestCMS.offlineUser();
        offlineUser.forEach(user => {
          this.liveData(user.properties)
        })
      }
    }
  }


  animatePoint = () => {
    try {
      if(this.props.hideDrivers) {
        if (this.geoJsonLayer) {
          this.geoJsonLayer.current.leafletElement.clearLayers().addData(this.props.geodata.data);
        }
  
        // if (this.gpsJsonLayer) {
        //   this.gpsJsonLayer.current.leafletElement.clearLayers().addData(this.props.gpsdata.data);
        // }
      } else {
        this.geoJsonLayer.current.leafletElement.clearLayers();
        // this.gpsJsonLayer.current.leafletElement.clearLayers();
      }
    } catch(err) {
      console.log(err)
    }

    this.animationTimeout = setTimeout(() => {
        this.animation = window.requestAnimationFrame(this.animatePoint);
      }, 1000)
  }


  showPathInfo = (e) => {
    this.props.toogleSpinner();

    let raw = restClient.service('raw');

    if(this.props.selectedDriver === null && this.state.selectedDay === null) return;
    raw
      .find({
        query: {
          userId: this.props.selectedDriver.id,
          gjson: true,
          lat: e.lngLat.lat,
          lng:e.lngLat.lng,
          ts: {
            $gte: '2019-03-24 00:00:00',
            $lt: '2019-03-24 23:59:59'
          },
          $sort: {
            ts: 1
          }
        }
      })
      .then(res => {
        this.props.toogleSpinner();
        this.setState({lineInfo: res});
      }).catch(() => {
      })

  }

  clearData = () => {
    this.setState({
      lineInfo: null
    })
  }

  convertToPoint = (feature, latlng) => {
    // let color = '#328BD8';
    // console.log(feature.properties)
    // if (feature.properties.meta.hasOwnProperty('st') && feature.properties.meta.st.length === 0) {
    //   const user = find(this.props.driverList, ['id', String(feature.properties.userId)])
    //   if (user.IsCheckedIn) {
    //     color = '#28B200';
    //   } else {
    //     color = '#328BD8';
    //   }

    // } else if (feature.properties.meta.hasOwnProperty('st') &&
    //   feature.properties.meta.st.length === 1) {

    //     if (feature.properties.meta.st.includes('3')) {
    //       color = '#F28406';
    //     } else {
    //       color = '#F62D2D';
    //     }
    // } else if (feature.properties.meta.hasOwnProperty('st') &&
    //   feature.properties.meta.st.length > 1 ) {

    //     if (feature.properties.meta.st.includes('0') ||
    //         feature.properties.meta.st.includes('1') ||
    //         feature.properties.meta.st.includes('2')) {
    //       color = '#F62D2D';
    //     } else {
    //       color = '#F28406';
    //     }
    //   }
    if(latlng){
      let ts = feature.properties.ts;
      if(feature.properties.offline){
        return L.marker(latlng,{icon: InactiveDriver});
      }
      var date = moment(ts);
      var now = moment();
      var msInMinutes = now.diff(date, 'minutes');
      if(msInMinutes>10){
        return L.marker(latlng,{icon: InactiveDriver});
      }
      if(feature.properties.meta.st===1){
        return L.marker(latlng,{icon: AvailableDriver});
      }
      if(this.props.hideDeliveredDrivers) {
        if(feature.properties.meta.st===2){
          return L.marker(latlng,{icon: AssignedDriver});
        }
      }
      if(feature.properties.meta.st===3){
        return L.marker(latlng,{icon: DeliveringDriver});
      }
    }
  }

  convertToGpsPoint = (feature, latlng) => {
    if (latlng) {
      return L.circleMarker(latlng, {
        radius: 7,
        fillColor: "#00c3a9",
        color: "#009e83",
        weight: 1,
        opacity: 0,
        fillOpacity: 0.8

    })
    }
  }

  onEachFeature = (feature, layer) => {
    layer.on({
          click: (e) => {            
            this.displayUser(e, feature)
          }
        });
  }

  onEachGpsFeature = (feature, layer) => {
    layer.on({
          click: (e) => this.displayGpsUser(e, feature)
        });
  }

  onEachCustomPolygon = (feature, layer) => {
    layer.bindTooltip(feature.properties.name);
    if(this.props.selectedPolygon) {
      if(this.props.selectedPolygon.id===parseInt(feature.properties.id)){
        layer.setStyle({
          color: 'green'
        })
      } else {
        layer.setStyle({
          color: '#a64feb'
        })
      }
    }
    layer.on({
      click: async (e) => {
        if(this.props.customPolygons.length===1) {
          let layer=e.target;
          layer.setStyle({
            color: 'green'
          })
          let suggestedPoint = await agent.BestRoute.getStation(feature.properties.id,'custom')
          this.props.suggestedPoint(suggestedPoint.data);
          this.props.enableSuggestPoint(true);
          this.props.selectPolygon(feature.properties)
        }
      }
    })
  }

  onEachFixedPolygon = (feature, layer) => {
    layer.bindTooltip(feature.properties.name);
    if(this.props.alreadySelectedPolygon.includes(feature.properties.id)){
      layer.setStyle({
        color: 'black'
      })
    } else{
      layer.setStyle({
        color: '#a64feb'
      })
    }
    layer.on({
      click: async (e) => {
        if(!this.props.alreadySelectedPolygon.includes(feature.properties.id)){
          let layer=e.target;
          let array = this.props.selectedFixedPolygon;
          if(array.includes(feature.properties.id)){
            for(let i=0; i<array.length;i++){
              if(parseInt(array[i])===parseInt(feature.properties.id)) {
                array[i] = null
              }
            }
          } else {
            array.push(feature.properties.id)
          }
          this.props.selectFixedPolygon(compact(array));
          if(compact(array).includes(feature.properties.id)) {
            layer.setStyle({
              color: 'green'
            })
          } else {
            layer.setStyle({
              color: '#a64feb'
            })
          }
          let suggestedPoint = await agent.BestRoute.getStation(this.props.selectedFixedPolygon.join(','),'fixed')
          this.props.suggestedPoint(suggestedPoint.data);
          this.props.enableSuggestPoint(true);
        }
      },
      mouseover:(e) => {
        let layer=e.target;
        layer.options["color"]="green";
      }
    })
  }

  onEachRoutePoint = (feature,layer) => {
    let iconUrl = L.divIcon({
      className: 'custom-icon',
      iconSize: [22, 22],
      iconAnchor: [20, 22],
      popupAnchor: [0, -22],
      html: ReactDOMServer.renderToString(<Icon perc={feature.properties.id} color={feature.properties.color}/>)
    });
    layer.setIcon(iconUrl)
  }

  onEachPickPoint = (feature, layer) => {
    layer.setIcon(StationPoint)
    layer.on({
      click: (e) =>{
        this.props.changePosition({
          center: {
            lng: feature.coordinates[0],
            lat: feature.coordinates[1],
          },
          zoom: 14
        })
          let order = this.props.allDeliveryPoints.map(delivery=> {
            if(delivery.warehouse.split(",").includes(feature.properties.info.name)) {
                return delivery
            }
            return null
        })
        this.props.selectOrder(compact(order))
        this.props.selectPickup(feature.properties.info.geojson)
        }
    })
  }

  onEachStartPoint = (feature,layer) => {
      let iconUrl = L.divIcon({
        className: 'custom-icon',
        iconSize: [22, 22],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
        html: ReactDOMServer.renderToString(<StartIcon color={feature.properties.info.color}/>)
      });
    layer.setIcon(iconUrl)
    layer.on({
      click: (e) => {
        this.props.selectOrderPoint(feature.properties.info)
      }
    })
  }


  displayUser = (e, feature) => {
    this.props.changePosition({
      center: {
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      },
      zoom: this.props.currentZoom>16?this.props.currentZoom:16
    })

    const selectedDriver = find(this.props.driverList, ['id', String(feature.properties.userId)])
    this.props.toggleSelectedDriver(selectedDriver);
    this.props.changePinPoint({
      lng: feature.geometry.coordinates[0],
      lat: feature.geometry.coordinates[1],
    })
  }

  displayGpsUser = (e, feature) => {
    const info = find(this.props.deviceList, ['imei-number', feature.properties.userId]);
    this.props.toggleSelectedDriver({
      firstName: info.name,
      lastName: '',
      type: 'gps',
      speed: feature.properties.speed,
      userId: feature.properties.userId,
      id: feature.properties.id,
      lastUpdate: feature.properties.lastUpdate,
      lat: feature.properties.latitude,
      lng: feature.properties.longitude,
      imageName: 'https://fmdelivery.koklass.com/backend/no-image.jpg',
      deviceId: feature.properties.userId,
    });
  }

  mapStyle = (feature) => {
    return {
      color: '#a64feb',
      weight: 4
    }
  }

  getOrList(d) {
    let status = d.deliveryStatus
    let styleName = ''

    if (status && (status.toLowerCase() === 'ready for delivery' || status.toLowerCase() === 'confirmed')) {
      styleName = 'order-confirm'
    } else if (status.toLowerCase() === 'delivering') {
      styleName = 'order-delivering'
    } else if (status && status.toLowerCase() === 'delivered') {
      styleName = 'order-delivered'
    } else {
      styleName = 'order-cancel'
    }
    return <p key={`order-${d.orderNumber}`} className={styleName}> {d.orderNumber} </p>
  }

  getMarker(d) {
    let {status} = d

    if (status.length === 0) {
      return false
    }
      let driver = find(this.props.driverList, ['id', String(d.driverId)]);
      let driverName = `${driver.firstName} ${driver.lastName}`;
      let pointer;

      if ( includes(status, 'Ready for Delivery') ) {
       pointer = ConfirmPoint;
      } else if ( includes(status, 'Delivering') ) {
        pointer = DeliveringPoint;
      } else if ( includes(status, 'Delivered') ) {
        pointer = DeliveredPoint;
      } else {
        pointer = CancelPoint;
      }
      return (
        <Marker
          icon={pointer}
          key={`marker-${d.id}`}
          position={[d.destinationLatitude, d.destinationLongitude]}>
            <Popup>
              <div className="custom__popover">
                <div className={`popover__title ${d.status}`}>
                  {driverName}
                </div>
                  <div className="popover__info">
                    {d.length !== 0 &&
                      this.getOrList(d.orders)}
                  </div>
              </div>
            </Popup>
        </Marker>
      )
  }

  deliveryMarker(d) {
    let startTime = `${d.order_date +' '+ d.order_time}`;
    let endTime = new Date();
    let hours = moment
            .duration(moment(endTime, 'YYYY/MM/DD HH:mm')
            .diff(moment(startTime, 'YYYY/MM/DD HH:mm'))
            ).asHours();
    let pointer;
    if (hours>72){
       pointer = Day4Point;
      } else if ( hours<72 && hours>48 ) {
        pointer = Day3Point;
      } else if ( hours<48 && hours>24 ) {
        pointer = Day2Point;
      } else if( hours<24 ) {
        pointer = Day1Point;
      } 
      if(d.isFiltered) {
        if(d.schedule_date===moment().format('YYYY-MM-DD') && d.isFiltered) {
          pointer = TodayNoShiftPoint;
        }
        if(d.schedule_date===moment().add(1, 'days').format('YYYY-MM-DD') && d.isFiltered) {
          pointer = TomorrowNoShiftPoint;
        }
        if(d.schedule_date=== moment().subtract(1, 'days').format('YYYY-MM-DD') && d.isFiltered) {
          pointer = YesterdayNoShiftPoint;
        }
        if(d.schedule_date< moment().subtract(1, 'days').format('YYYY-MM-DD') && d.isFiltered) {
          pointer = YesterdayNoShiftPoint;
        }
        if(d.schedule_date===moment().format('YYYY-MM-DD') && d.schedule_type==="early-morning") {
          pointer = TodayEarlyMorningPoint;
        }
        if(d.schedule_date===moment().add(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="early-morning") {
          pointer = TomorrowEarlyMorningPoint;
        }
        if(d.schedule_date=== moment().subtract(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="early-morning") {
          pointer = YesterdayEarlyMorningPoint;
        }
        if(d.schedule_date<moment().subtract(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="early-morning") {
          pointer = YesterdayEarlyMorningPoint;
        }
        if(d.schedule_date===moment().format('YYYY-MM-DD') && d.schedule_type==="morning") {
          pointer = TodayMorningPoint;
        }
        if(d.schedule_date===moment().add(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="morning") {
          pointer = TomorrowMorningPoint;
        }
        if(d.schedule_date=== moment().subtract(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="morning") {
          pointer = YesterdayMorningPoint;
        }
        if(d.schedule_date< moment().subtract(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="morning") {
          pointer = YesterdayMorningPoint;
        }
        if(d.schedule_date===moment().format('YYYY-MM-DD') && d.schedule_type==="afternoon") {
          pointer = TodayAfternoonPoint;
        }
        if(d.schedule_date===moment().add(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="afternoon") {
          pointer = TomorrowAfternoonPoint;
        }
        if(d.schedule_date< moment().subtract(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="afternoon") {
          pointer = YesterdayAfternoonPoint;
        }
        if(d.schedule_date=== moment().subtract(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="afternoon") {
          pointer = YesterdayAfternoonPoint;
        }
        if(d.schedule_date===moment().format('YYYY-MM-DD') && d.schedule_type==="evening") {
          pointer = TodayEveningPoint;
        }
        if(d.schedule_date===moment().add(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="evening") {
          pointer = TomorrowEveningPoint;
        }
        if(d.schedule_date=== moment().subtract(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="evening") {
          pointer = YesterdayEveningPoint;
        }
        if(d.schedule_date<moment().subtract(1, 'days').format('YYYY-MM-DD') && d.schedule_type==="evening") {
          pointer = YesterdayEveningPoint;
        }
      }
      if(pointer) {
        return (
          <Marker
            icon={pointer}
            key={`marker-${d.order_number}`}
            position={[d.geojson.coordinates[1], d.geojson.coordinates[0]]}>
              <Popup>
                <div className="custom__popover">
                  <div className={`popover__title active`}>
                    {d.location || 'N/A'}
                  </div>
                    <div className="popover__info">
                      {d.order_number}
                    </div>
                </div>
              </Popup>
          </Marker>
        )
      }
  }

  addPosition = (e) => {
    if(this.props.createPolygon){
      const newPos = [e.latlng.lat, e.latlng.lng];
      this.setState(prevState => (
        {
          positions: prevState.positions.concat([newPos])
        }
      ));
      this.props.createNewPolygon(this.state.positions.concat([newPos]).concat([this.state.positions[0]]))
    }
  }

  zoomUpdate = (e) => {
    this.props.setCurrentZoom(e.target._zoom)
  }

  render() {
    let color = [ '#5dd916c4','#137ac9c4','#e9ae36c4','#ff704bc4' ]
    return (
      <div className='map-section'>
        <Leaflet
          animate={true}
          ref={this.mapRef}
          center={this.props.center}
          onClick={this.addPosition}
          onzoomend={this.zoomUpdate}
          zoom={this.props.zoom}
          maxZoom={19}
          zoomControl={false}>
          <ZoomControl position="bottomleft"/>
          {this.props.isStreet ? (
             <TileLayer
              attribution='Powered By <a href="https://ekbana.com">Ekbana</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
           <ReactLeafletGoogleLayer
             googleMapsLoaderConf={{KEY: 'AIzaSyDHI-cI_xwKCQbTSsSiQaveVjhi3Yo5Luw'}}
             type={'satellite'} />
          )}
          
          {!isEmpty(this.props.selectedOrderPoint)?!isEmpty(this.props.circlePosition)?
            <Circle 
              center={{lat:this.props.circlePosition.lat, lng: this.props.circlePosition.lng}}
              fillColor="blue" 
              radius={3000}/>
            :''
          :''}

            { !isEmpty(this.props.topoJson)?
            <TopoJSON
              data={this.props.topoJson}
            />:'' }

          <Polygon positions={this.state.positions} color="blue" />
          { this.props.preloadPolygons.length!==0? this.props.preloadPolygons.map((polygon, Key) =>{
            polygon.geojson['properties']={'id':polygon.id, 'name': polygon.name}
            return(
              <GeoJSON key={Key} data={polygon.geojson} onEachFeature={this.onEachFixedPolygon} properties={{'id':polygon.id }} />
            )
          }
          ):'' }

          { this.props.customPolygons.length!==0? this.props.customPolygons.map((polygon, Key) =>{
            polygon.geojson['properties']={'id':polygon.id, 'name': polygon.name, 'station': polygon.station}
            return(
              <GeoJSON key={Key} data={polygon.geojson} onEachFeature={this.onEachCustomPolygon} properties={{'id':polygon.id }} />
            )
          }
          ):'' }

          { !isEmpty(this.props.route)? this.props.route.features?this.props.route.features.map((route, Key)=>{
            let style=()=> {
              return {
                color: route.properties.type==='path'?color[route.properties.route-1]:'grey',
                weight: 4,
                dashArray: route.properties.type==='path'?'':'8 6'
              }
            }
            if(this.props.showSelectedRoute) {
              if(find(this.props.routeNumber,['route_id',parseInt(route.properties.route)])){
                return(
                  <GeoJSON data={route} style={style} key={Key} onEachFeature={this.onEachLineString} />
                )
              } else {
                return null;
              }
            } else {
              return(
                <GeoJSON data={route} style={style} key={Key} onEachFeature={this.onEachLineString} />
              ) 
            }
          }
          )
          :'':'' }



          { !isEmpty(this.props.suggestedPoints) ? 
          <>
          {this.props.suggestedPoints.suggested.map(station => 
              <Marker
                icon={StationPoint}
                key={`marker-${station.station_id}`}
                position={[station.geojson.coordinates[1], station.geojson.coordinates[0]]}>
              </Marker>
            )}

            {this.props.suggestedPoints.available.map(station => 
                <Marker
                  icon={StationPoint}
                  key={`marker-${station.station_id}`}
                  position={[station.geojson.coordinates[1], station.geojson.coordinates[0]]}>
                </Marker>
            )}
          </>
          :'' }

          { this.props.hideDelivery?'':this.props.deliveryPoints.length!==0? this.props.deliveryPoints.map(point =>{
            if(!point.is_confirmed){
              return this.deliveryMarker(point)
            }
            return null
          }          
          ):'' }

          {/* { !isEmpty(this.props.selectedStartPoint)?
            <Marker
              icon={SelectedStationPoint}
              position={[this.props.selectedStartPoint.geojson.coordinates[1], this.props.selectedStartPoint.geojson.coordinates[0]]}>
            </Marker> 
          :"" } */}

          { !isEmpty(this.props.route)?this.state.routeNumber.length!==0?this.state.routeNumber.map((route, routeKey)=>
              route.delivery_list.map((delivery, deliveryKey) => {
                delivery.geojson['properties'] = {'id':delivery.position|| '0','color': route.color};
                return(
                  <GeoJSON key={deliveryKey} data={delivery.geojson} style={this.mapStyle} onEachFeature={this.onEachRoutePoint} />
                )
              })
            ):'':''}

          { !isEmpty(this.props.route)?this.state.routeNumber.length!==0?this.state.routeNumber.map((route, routeKey)=>{
            if(route.path){
              return(
                <GeoJSON key={routeKey} data={route.path} style={this.mapStyle} />
              )
            }
            return null;
          }

            ):'':''}

            {isEmpty(this.props.selectedOrderPoint)?this.props.selectedOrders.length===0?this.props.dropTabName === 'destination'||this.props.dropTabName === 'both'?
              this.props.destinationPoints.length!==0? 
                this.props.destinationPoints.map((dest, Key)=>{
                  let color = '';
                  if(dest.order_status==="Ready for Delivery"){
                    if(dest.assign_vehicle){
                      color = '#B0ACD1'
                    } else {
                      color = '#F5C315'
                    }
                  } 
                  else if(dest.order_status==="Delivering"){
                    color = "#89BFE4"
                  } 
                  else if(dest.order_status === "Delivered") {
                    color = '#8ED2C9'
                  }
                  else if(dest.order_status === "Cancelled") {
                    color = '#F0A79E'
                  }
                  dest['color'] = color;
                  dest.geojson['properties'] = { "info": dest }
                  return(
                    <GeoJSON key={Key} data={dest.geojson} style={this.mapStyle} onEachFeature={this.onEachStartPoint} />
                  )
                }
                  )
                :''
                :''
                :''
                :''
            } 

          { this.props.dropTabName === 'pickup' || this.props.dropTabName === 'both'? isEmpty(this.props.selectedPickup)?this.props.pickupPoints.length !== 0 ?
            this.props.pickupPoints.map((point, Key)=>{
              point.geojson['properties'] = { "info": point }
              return(
                <GeoJSON data={point.geojson} key={Key} onEachFeature={this.onEachPickPoint} />
              )
            }
              ):'':'':'' }
          
          { !isEmpty(this.props.selectedPickup)?
              <Marker
                icon={StationPoint}
                position={[this.props.selectedPickup.coordinates[1], this.props.selectedPickup.coordinates[0]]}
                onclick={this.props.selectOrderPoint.bind(this,{})}
              >
              </Marker>
          :'' } 

          {  isEmpty(this.props.selectedOrderPoint)?this.props.selectedOrders.length!==0? 
             this.props.selectedOrders.map((order, Key) =>{  
                order.geojson['properties'] = { "info": order }
                return(
                  <GeoJSON key={Key} data={order.geojson} style={this.mapStyle} onEachFeature={this.onEachStartPoint} />
                )
              })
          :'':'' }


          { !isEmpty(this.props.selectedOrderPoint)?
            <Marker
              icon={SelectedOrderPoint}
              position={[this.props.selectedOrderPoint.geojson.coordinates[1], this.props.selectedOrderPoint.geojson.coordinates[0]]}>
            </Marker> 
          :"" }

          { !isEmpty(this.props.hoveredOrderPoint)?
            <Marker
              icon={SelectedOrderPoint}
              position={[this.props.hoveredOrderPoint.geojson.coordinates[1], this.props.hoveredOrderPoint.geojson.coordinates[0]]}>
            </Marker> 
          :"" }


          {this.props.pathInfo !== null && this.props.pathInfo.geometry !== undefined && (
            <CustomPath positions={this.props.pathInfo.geometry.coordinates} options={this.state.antPathOptions} />
          )}

          {this.props.pathInfo !== null && this.props.pathInfo.geometry === undefined && (
            <GeoJSON  data={this.props.pathInfo} style={this.mapStyle}/>
          )}

          {this.props.tripPath !== null && (
            <CustomPath positions={this.props.tripPath.geometry.coordinates} options={this.state.antPathOptions} />
          )}
          
          {this.props.nodePath &&
            this.props.nodePath.data.map((d, index) => {
              return (
               <GeoJSON key={`processed_${index}`} data={d.geojson} style={this.mapStyle} />
              )
            })
          }

          {this.props.processedPathInfo &&
            this.props.processedPathInfo.map((d, index) => {
              return (
                <GeoJSON key={`processed_${index}`} data={d.geojson} style={this.mapStyle} />
              )
            })
          }


          {this.props.gpsPath && this.props.timelineInfo && this.props.gpsPath.length !== 0 &&
                <GeoJSON key={`processed_${0}`} data={this.props.gpsPath[0]} style={this.mapStyle} />
          }
        
          {this.props.orderList !== null && 
            this.props.orderList.map((d, index) => {
              if (this.props.searchkey !== null && d.order_id !== this.props.searchkey) {
                return null;
              }
              return (
                <Fragment key={`pointer-${index}`}>
                <Marker
                  icon={RestaurantPoint}
                  position={{lng:d.vendor_latlong.Long, lat:d.vendor_latlong.Lat}}>
                  <Popup>
                    <div className="popover__info">
                      <div className="popupTitle">
                        <span>Restaurant Point</span>
                      </div>
                      <div className="popupDetail">
                        <p>
                          <span>{d.vendor_name} </span>
                        </p>      
                      </div>
                    </div>
                  </Popup>    
                </Marker>

               <Marker
                icon={CustomerPoint}
                position={{lng:d.customer_location.Long, lat:d.customer_location.Lat}}>
                 <Popup>
                  <div className="popover__info">
                    <div className="popupTitle">
                      <span>Customer Location</span>
                    </div>
                    <div className="popupDetail">
                      <p>
                        <span>{d.customer_name} </span>
                      </p>
  
                    </div>
                  </div>
                  </Popup>
                </Marker>
              </Fragment>
              )
            })}


          {this.props.pinPoint.length !== 0 &&
            this.props.pinPoint.map((d, index) => {
              return (
                <Marker
                key={`marker_${index}`}
                position={d.cordinates}>
                  <Popup>
                  <div className="popover__info">
                  {/*<button className="crossBtn"><img src={Cross} alt="cross"/></button> */}
                    <div className="popupTitle">
                      <span>{d.name}</span>
                    </div>
                    <div className="popupDetail">
                    {d.startTime && (
                      <p>
                        <span>Enter at </span>: {d.startTime ? d.startTime : '...'}
                      </p>
                    )}

                    {d.endTime && (
                      <p>
                        <span>Left at </span>: {d.endTime ? d.endTime : '...'}
                      </p>
                    )}
                    {d.stayIn && (
                      <p>
                        <span>Stayed For  </span>: {d.stayIn ? d.stayIn : '...'}
                      </p>
                    )}
                    </div>
                </div>
                </Popup>

                </Marker>
              )
            })
          }

        {this.props.selectedDriver && this.props.selectedPinPoint &&
            <Fragment>
              <CircleMarker center={this.props.selectedPinPoint} radius={10} color='#000000' fillOpacity={1} fill={true} />
              <CircleMarker center={this.props.selectedPinPoint} radius={8} color='#FFFFFF'  fillOpacity={1} fill={true} />
              {/* <Marker icon={this.state.selectedMarker} position={this.props.selectedPinPoint} /> */}
              {/* <CircleMarker center={this.props.selectedPinPoint} radius={5} color={this.state.selectedColor}  fillOpacity={1} fill={true} /> */}
            </Fragment>
        }

        {
          this.props.suggestedDriver.length!==0?
            this.props.suggestedDriver.map((driver, Key)=>
              <Fragment key={Key}>
                <CircleMarker center={driver.coordinates} radius={10} color='#000000' fillOpacity={1} fill={true} />
                <CircleMarker center={driver.coordinates} radius={8} color='#FFFFFF'  fillOpacity={1} fill={true} />
              </Fragment>
            )
          :''
        }

        


          {/* {this.props.deliveries &&
            this.props.deliveries.length !== 0 &&
            this.props.deliveries.map((d, index) => this.getMarker(d))} */}

          <GeoJSON
            pointToLayer={this.convertToPoint}
            data={this.props.geodata.data} ref={this.geoJsonLayer} onEachFeature={this.onEachFeature}/>
          {/* <GeoJSON
            pointToLayer={this.convertToGpsPoint}
            data={this.props.gpsdata.data} ref={this.gpsJsonLayer} onEachFeature={this.onEachGpsFeature}/> */}
        </Leaflet>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);