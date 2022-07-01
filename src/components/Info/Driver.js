import React, {Component} from 'react';
import moment from 'moment';
import { includes, compact } from 'lodash';
import Cross from '../../assets/images/cross.svg';

import restClient from '../../rest/feathers';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import PathOne from '../../assets/images/path1.png';
// import PathTwo from '../../assets/images/path.svg';
// import PathBlueOne from '../../assets/images/pathblue1.png';
// import PathBlueTwo from '../../assets/images/pathblue2.png';


import agent from '../../agent';

class Driver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      speed: 'N/A',
      lastSeen: 0,
      selectedDate: new Date(),
      'pinpoint': null,
      isOnline: false,
      selectedUserId: null,
      timer: null,
      address: '',
    }

    this.toggleTimelineInfoEvent = this.toggleTimelineInfoEvent.bind(this)
    this.fetchProcessedData = this.fetchProcessedData.bind(this)
    this.toggleProcessData = this.toggleProcessData.bind(this)
    this.fetchPoint = this.fetchPoint.bind(this)
  }

   getSpeed = async() => {
    const {geodata, selectedDriver} = this.props;
    let filterMapData = geodata.data.features.map(prop => {
      if(String(prop.properties.userId)===String(selectedDriver.id)){
        return prop
      }
      return null;
    })
    const getInfo = compact(filterMapData)[0];
    if (getInfo !== undefined) {
      var date = moment(getInfo.properties.ts);
      var now = moment();
      var msInMinutes = now.diff(date, 'minutes');
      if(msInMinutes<60){
        this.setState({lastSeen: moment(getInfo.properties.ts).fromNow(Boolean)})
      } else {
        this.setState({ lastSeen: 0 })
      }
      if (this.state.pinpoint === null) {
        // let data = await agent.Trips.getPinPoint(getInfo.properties.lat, getInfo.properties.lng);

        // this.setState({pinpoint: data.name})
      }
    }
  }

  // getGpsSpeed = async() => {
  //   const {gpsdata, selectedDriver} = this.props;

  //   const getInfo = filter(gpsdata.data.features, ['properties.uniqueId', selectedDriver.id])[0];

  //   if (getInfo !== undefined) {
  //     this.setState({speed: Math.floor(getInfo.properties.speed * 3.6 * 100) / 100, lastSeen: moment(getInfo.properties.lastUpdate).fromNow(Boolean)})

  //     if (this.state.pinpoint === null) {
  //       // let data = await agent.Trips.getPinPoint(getInfo.properties.lat, getInfo.properties.lng);

  //       // this.setState({pinpoint: data.name})
  //     }
  //   }
  // }

  async componentDidMount() {
    //Fetch foodmandu delivery order
    const {geodata, selectedDriver} = this.props;
    this.fetchPoint();
    this.setState({
      selectedUserId: selectedDriver.id
    })
    let filterMapData = geodata.data.features.map(prop => {
      if(String(prop.properties.userId)===String(selectedDriver.id)){
        return prop
      }
      return null;
    })
    const getInfo = compact(filterMapData)[0];
    if(getInfo){
      let location = await agent.Location.location(getInfo.geometry.coordinates[1], getInfo.geometry.coordinates[0]);
      this.setState({
        address: location.data.formatted_address.name
      })
    } else {
      this.setState({
        address: ''
      })
    }
    // if (this.props.selectedDriver.type === 'gps') {
    //     let gpsTimer = setInterval(this.getGpsSpeed, 3000);
    //     let isOnline =  includes(this.props.gpsActiveList, this.props.selectedDriver.id)
    //     this.setState({gpsTimer, isOnline});
    // } else {
      if (includes(this.props.activeList, String(this.props.selectedDriver.id))) {
        let timer = setInterval(this.getSpeed, 1000);
        console.log(timer)
        
        let isOnline =  includes(this.props.activeList, String(this.props.selectedDriver.id))
        this.setState({isOnline});
      } else {
        let timer = setInterval(this.getSpeed, 1000);
        console.log(timer)
        this.setState({
          isOnline: false,
        })
      }
    // }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
    // clearInterval(this.state.gpsTimer);
  }

  async componentDidUpdate(prevProps) {
    if(prevProps.selectedDriver !== this.props.selectedDriver) {
      this.setState({
        selectedUserId: this.props.selectedDriver.id
      })
      const {geodata, selectedDriver} = this.props;
      let filterMapData = geodata.data.features.map(prop => {
        if(String(prop.properties.userId)===String(selectedDriver.id)){
          return prop
        }
        return null;
      })
      const getInfo = compact(filterMapData)[0];
      if(getInfo){
        let location = await agent.Location.location(getInfo.geometry.coordinates[1], getInfo.geometry.coordinates[0]);
        this.setState({
          address: location.data.formatted_address.name
        })
      } else {
        this.setState({
          address: ''
        })
      }
      if (includes(this.props.activeList, String(this.props.selectedDriver.id))) {
        let timer = setInterval(this.getSpeed, 1000);
        console.log(timer)
        let isOnline =  includes(this.props.activeList, String(this.props.selectedDriver.id))
        this.setState({isOnline});
      }
      else {
        this.setState({
          lastSeen: 0,
          isOnline: false,
        })
      }
    }
  }

  // componentDidUpdate(prevProps) {
  //   if(this.props.selectedDriver !== prevProps.selectedDriver) {
  //     this.fetchPoint();
  //     this.setState({
  //       selectedUserId: this.props.selectedDriver.id
  //     })
  //   }
  // }

  // componentWillReceiveProps(props) {
  //   if (this.state.selectedUserId !== props.selectedDriver.id  && this.state.selectedUserId !== null) {
  //     this.fetchPoint();
  //     this.setState({
  //       selectedUserId: this.props.selectedDriver.id
  //     })
  //   }


    // if (includes(this.props.activeList, String(this.props.selectedDriver.id))) {
    //   let isOnline =  includes(this.props.activeList, String(this.props.selectedDriver.id));
    //   this.setState({isOnline});
    // }
  // }

  // async getText() {
  //   let res = await agent.Token.get(this.props.selectedDriver.id);
  //   window.open( `https://trackme.koklass.com/${res}`)
  //   return `https://trackme.koklass.com/${res}`;
  // }


  handleChange = (date) => {
    this.props.closeDate();
    this.setState({selectedDate: date});
    this.props.selectedDateEvent(date);
    if (this.props.showPathInfo) {
      this.fetchPath(date);
    } else if (this.props.messageInfo) {
      this.fetchProcessedData(date, this.props.messageInfo);
    } else if (this.props.nodeInfo) {
      this.fetchNodeData(date, this.props.nodeInfo);
    }
  }

  toggleShowPath = () => {
    if (!this.props.showPathInfo) {
      this.fetchPath();
    } else {
      this.props.showPath(null);
    }
    this.props.togglePathInfo();
  }

  rawtoggleShowPath = () => {
    if (!this.props.showPathInfo) {
      this.rawfetchPath();
    } else {
      this.props.showPath(null);
    }

    this.props.togglePathInfo();
  }

  fetchPath = async(date) => {
    date = date === undefined ? this.state.selectedDate : date;

    this.props.toogleSpinner();

    //let res = await agent.Trips.getPath(this.props.selectedDriver.id, moment(this.state.selectedDate).format('YYYY-MM-DD'));

        // this.props.toogleSpinner();
    // this.props.showPath(res )

    // if (compressData.status === 1003) {
    //   debugger;
    if(this.props.selectedDriver.type === 'gps') {
      let gpsData = await agent.Trips.getGpsPath(this.props.selectedDriver.deviceId, moment(date).format('YYYY-MM-DD'));
        this.props.toogleSpinner();
        this.props.showPath(null);
        this.props.nodePath(null);
        if (gpsData.length !== 0) {
          this.props.showPath({
            "type": "Feature",
            "properties": {},
            "geometry": {
              coordinates: gpsData,
              type: "LineString"
            }
          })
        }
    } else {
    let user = restClient.service('user')
    user
      .find({
        query: {
          userId: this.props.selectedDriver.id,
          date: moment.utc(this.state.selectedDate).format(),
          createdAt: {
            $gte: moment()
              .startOf('day')
              .format()
          },
          $sort: {
            ts: -1
          }
        }
      })
      .then(res => {
        this.props.toogleSpinner();
        this.props.showPath(null);
        this.props.nodePath(null);

        if (res !== null) {
          this.props.showPath({
              "type": "Feature",
              "properties": {},
              "geometry": res
            }
          )
        }
      })

      // let compressData = await agent.Trips.getCompressPath(this.props.selectedDriver.id, moment(date).format('YYYY-MM-DD'));

      // if (compressData.status === 1003) {
      //   let user = restClient.service('user')
      //     user
      //       .find({
      //         query: {
      //           userId: this.props.selectedDriver.id,
      //           date: moment.utc(date).format(),
      //           createdAt: {
      //             $gte: moment()
      //               .startOf('day')
      //               .format()
      //           },
      //           $sort: {
      //             ts: -1
      //           }
      //         }
      //       })
      //       .then(res => {
      //         this.props.toogleSpinner();
      //         this.props.showPath(null);
      //         this.props.nodePath(null);
      //         this.props.showPath({
      //             "type": "Feature",
      //             "properties": {},
      //             "geometry": res
      //           }
      //         )
      //       })
      // } else {
      //   this.props.toogleSpinner();
      //   this.props.showPath(null);
      //   this.props.nodePath(null);
      //   this.props.showPath({
      //       "type": "Feature",
      //       "properties": {},
      //       "geometry": {
      //         coordinates: JSON.parse(compressData.value),
      //         type: "LineString"
      //       }
      //     }
      //   )
      // }

    }


  }

  rawfetchPath = async(date) => {
    this.props.toogleSpinner();
    let user = restClient.service('user')
    user
      .find({
        query: {
          userId: this.props.selectedDriver.id,
          date: moment.utc(this.state.selectedDate).format(),
          createdAt: {
            $gte: moment()
              .startOf('day')
              .format()
          },
          $sort: {
            ts: -1
          }
        }
      })
      .then(res => {
        this.props.toogleSpinner();
        this.props.showPath({
            "type": "Feature",
            "properties": {},
            "geometry": res
          }
        )
      })
  }

  toggleProcessData = () => {
    // this.props.messageStatInfo();
    // this.fetchProcessedData(undefined, !this.props.messageInfo);
  }

  fetchProcessedData = async(date, stat) => {
    if (stat) {
      date = date === undefined ? this.state.selectedDate : date;
      this.props.toogleSpinner();
      let res = await agent.Dashboard.pathData({user:this.props.selectedDriver.type==="gps"?this.props.selectedDriver.deviceId:this.props.selectedDriver.id,date: moment(date).format('YYYY-MM-DD'), device:this.props.selectedDriver.type==="gps"?"g":"m" , org:'skrfuejheb'});

      this.props.toogleSpinner();
      this.props.showPath(null)
      this.props.nodePath(res)

    } else {
      this.props.showPath(null)
      this.props.nodePath(null)
    }
  }

   toogleNodeData = () => { 
    // this.props.nodeStatInfo();
    // this.fetchNodeData(undefined, !this.props.nodeInfo);
    if (this.props.nodeInfo) {
      this.fetchProcessedData(this.state.selectedDate,this.props.nodeInfo);
    } else {
      this.props.nodePath(null);
    }
    this.props.nodeStatInfo()
  }

  toggleTripTimeLine = () => {
    this.props.toggleTimelineInfo()
  }


   fetchNodeData = async(date, stat) => {
    if (stat) {
       date = date === undefined ? this.state.selectedDate : date;
      this.props.toogleSpinner();
      if (this.props.selectedDriver.type === 'gps') {
        let res = await agent.Trips.gpsPath(this.props.selectedDriver.deviceId, moment(date).format('YYYY-MM-DD'));
        this.props.toogleSpinner();
        // debugger;
        this.props.nodePath(res )
      } else {
        let res = await agent.Trips.nodePath(this.props.selectedDriver.id, moment(date).format('YYYY-MM-DD'));
        this.props.toogleSpinner();
        this.props.nodePath(res )
      }
    } else {
       this.props.nodePath(null)
       this.props.showPath(null)
    }
  }

  fetchPoint = async () => {
    // if (this.props.timelineInfo) {
    //   this.props.resetPoint();
    //   this.props.toggleTimelineInfo();
    // } else {

      // let token = await agent.Drivers.fmAuth();
      // let data = await agent.Drivers.fetchDeliveryPoint(this.props.selectedDriver.deviceId);

      // if (data.current_orders.length !== 0) {

        // this.props.changePoint({
        //   orderList: data.current_orders
        // });
        // this.props.toggleTimelineInfo();
        this.setState({
          selectedUserId: this.props.selectedDriver.id
        })
      // } else {

      // }

    // }

  }

  downloadCSV = () => {
    this.props.toogleSpinner();
    let raw = restClient.service('raw');
    raw
      .find({
        query: {
          userId: this.props.selectedDriver.id,
          ts: {
            $gte: moment.utc(this.state.selectedDate)
              .startOf('day')
              .format('YYYY-MM-DD HH:mm:ss'),
            $lt: moment.utc(this.state.selectedDate)
              .endOf('day')
              .format('YYYY-MM-DD HH:mm:ss')
          },
          $sort: {
            ts: 1
          }
        }
      })
      .then(res => {
        this.setState({loader: false})
        let data = [];
          data[0]=[];
          data[0].push("id");
          data[0].push("lat");
          data[0].push("lng");
          data[0].push("speed");
          data[0].push("direction");
          data[0].push("userId");
          data[0].push("ts");
          data[0].push("created_at");
          data[0].push("updated_at");
          data[0].push("ha");
          data[0].push("va");
          data[0].push("alt");
          data[0].push("b");
          data[0].push("m");
          data[0].push("n");
          data[0].push("av");
          data[0].push("cd");
          data[0].push("cw");
          data[0].push("ov");
          data[0].push("ws");
          data[0].push("ax");
          data[0].push("ay");
          data[0].push("az");
          data[0].push("ssid");
          data[0].push("poi");
          data[0].push("ev");
          data[0].push("accuracy");
          data[0].push("isPSMode");

          let i = 1;

          if(res) {
            for(let d of res) {
              data[i]=[];
              data[i].push(d.id);
              data[i].push(d.lat);
              data[i].push(d.lng);
              data[i].push(d.speed);
              data[i].push(d.direction);
              data[i].push(d.user_id);
              data[i].push(moment.utc(d.ts).local().format());
              data[i].push(d.created_at);
              data[i].push(d.updated_at);
              data[i].push(d.ha);
              data[i].push(d.va);
              data[i].push(d.alt);
              data[i].push(d.meta.b);
              data[i].push(d.meta.m);
              data[i].push(d.meta.n);
              data[i].push(d.meta.av);
              data[i].push(d.meta.cd);
              data[i].push(d.meta.cw);
              data[i].push(d.meta.ov);
              data[i].push(d.meta.ws);
              data[i].push(d.ax);
              data[i].push(d.ay);
              data[i].push(d.az);
              data[i].push(d.meta.ssid);
               data[i].push(d.meta.poi);
                data[i].push(d.meta.ev);
              data[i].push(d.meta.accuracy);
              data[i].push(d.meta.isPSMode);
              i++;
            }
          }

          this.props.toogleSpinner();

          let csvContent = '';
          let dataString;

          for(let [index, content] of data.entries()) {
            dataString = content.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
          }

          window.URL = window.URL || window.webkitURL;
          let link = document.createElement("a");
          let myBlob = new Blob([csvContent], {type : "text/csv"});
          let blobURL = window.URL.createObjectURL(myBlob);
          link.href = blobURL;
          link.download = 'info.csv';
          link.click();
          window.URL.revokeObjectURL(blobURL);
      });
  }

  closeInfo = () => {
    this.props.unSelectedUser();
    this.props.showPath(null);
    this.props.clearPinPoint();
    this.props.changePinPoint(null);
    this.props.resetPoint();
  }

  toggleTimelineInfoEvent = () => {
    if (this.props.nodeInfo) {
      this.fetchProcessedData(this.state.selectedDate,this.props.nodeInfo);
    } else {
      this.props.nodePath(null);
    }
    this.props.nodeStatInfo()
  }

  render() {
    // const {
    //   selectedDriver, toggleDeviceInfo, deviceInfo, showPathInfo,timelineInfo, nodeInfo, showTripTimeLine
    // } = this.props;
    const {
      selectedDriver, toggleDeviceInfo, deviceInfo, showPathInfo
    } = this.props;
    return (
      <div className="driver-infomation">
        <div className="user-info">
          <img src={`${selectedDriver.imageName}`} alt="user" className="img-fluid" />
          <ul>
            <li>
              {selectedDriver.firstName} {selectedDriver.lastName}
              <i className={`fa fa-circle pd-15 circle-status ${this.state.isOnline ? 'avilable': ''}`} aria-hidden="true"></i>
            </li>
            <li>
              <i>({this.state.address || 'N/A'})</i>
              <br/>
              <span>{this.state.pinpoint}</span>
              <i>({this.state.lastSeen || 'offline'})</i>
            </li>
          </ul>
        </div>

        <div className="calendar-section">
          <div className="custom-topline"></div>
          <button className="cross dirvers-detail" onClick={this.closeInfo}>
            <img src={Cross} alt="cross"/>
          </button>
          <div className="calendar-section-block" onClick={this.props.openDate}>
            <div className="input-group" data-provide="datepicker">
            <DatePicker
              dateFormat="yyyy-MM-dd"
              selected={this.state.selectedDate}
              onChange={this.handleChange}
              onClickOutside= {this.props.closeDate}
              />

              <i className="fa fa-calendar calendar" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <div className="user-direction">
          <ul>
            <li className={`${showPathInfo ? 'active': ''}`} onClick={this.toggleShowPath}>
            <div className="unhover_border">
                <svg id="Group_18" data-name="Group 18" xmlns="http://www.w3.org/2000/svg" width="13.841" height="17.952" viewBox="0 0 13.841 17.952">
                  <g id="Group_17" data-name="Group 17">
                    <g id="Group_16" data-name="Group 16">
                      <g id="Group_15" data-name="Group 15">
                        <path id="Path_2" data-name="Path 2" d="M1180.648,234.392c-.673-.79-1.362-1.528-1.967-2.329a2.552,2.552,0,1,1,4.51-1.418,2.284,2.284,0,0,1-.375,1.033,10.075,10.075,0,0,1-.648.9C1181.683,233.172,1181.183,233.756,1180.648,234.392Zm.032-5.166a1.253,1.253,0,0,0-1.27,1.233,1.254,1.254,0,0,0,2.508.044A1.243,1.243,0,0,0,1180.681,229.227Z" transform="translate(-1178.112 -227.887)" fill="#499e43"/>
                        <path id="Path_3" data-name="Path 3" d="M1188.76,245c-.675-.792-1.37-1.527-1.969-2.333a2.554,2.554,0,1,1,4.512-1.877,2.292,2.292,0,0,1-.35,1.449,7.374,7.374,0,0,1-.6.847C1189.847,243.718,1189.321,244.334,1188.76,245Zm-1.233-3.914a1.254,1.254,0,0,0,1.262,1.256,1.269,1.269,0,0,0,1.247-1.259,1.255,1.255,0,0,0-2.51,0Z" transform="translate(-1177.518 -227.109)" fill="#499e43"/>
                        <path id="Path_4" data-name="Path 4" d="M1186.85,233.812a.342.342,0,0,1,.394-.355c.26.028.518.064.776.106a.351.351,0,0,1,.312.4.36.36,0,0,1-.438.289q-.352-.052-.705-.1A.347.347,0,0,1,1186.85,233.812Z" transform="translate(-1177.471 -227.479)" fill="#499e43"/>
                        <path id="Path_5" data-name="Path 5" d="M1180.669,242.347c0,.332-.293.521-.512.361a5.354,5.354,0,0,1-.7-.647.315.315,0,0,1,.049-.449.34.34,0,0,1,.469,0c.2.178.4.355.587.543A.678.678,0,0,1,1180.669,242.347Z" transform="translate(-1178.019 -226.888)" fill="#499e43"/>
                        <path id="Path_6" data-name="Path 6" d="M1185.515,233.311c.235.015.437.026.638.043a.35.35,0,1,1-.039.7q-.4-.014-.8-.054a.345.345,0,1,1,.038-.688C1185.418,233.31,1185.484,233.311,1185.515,233.311Z" transform="translate(-1177.608 -227.489)" fill="#499e43"/>
                        <path id="Path_7" data-name="Path 7" d="M1184.007,238.773c-.245,0-.386-.116-.417-.29a.337.337,0,0,1,.245-.384c.282-.069.568-.129.854-.177a.338.338,0,0,1,.371.266.322.322,0,0,1-.213.4C1184.552,238.668,1184.247,238.722,1184.007,238.773Z" transform="translate(-1177.711 -227.152)" fill="#499e43"/>
                        <path id="Path_8" data-name="Path 8" d="M1181.776,238.82a.3.3,0,0,1,.231-.3c.268-.076.538-.149.81-.206a.344.344,0,0,1,.423.262.349.349,0,0,1-.272.415c-.258.071-.516.138-.776.2A.347.347,0,0,1,1181.776,238.82Z" transform="translate(-1177.843 -227.123)" fill="#499e43"/>
                        <path id="Path_9" data-name="Path 9" d="M1181.45,239.177a.33.33,0,0,1-.214.319c-.239.105-.477.214-.717.317a.348.348,0,0,1-.456-.157.324.324,0,0,1,.126-.45,7.32,7.32,0,0,1,.829-.366A.333.333,0,0,1,1181.45,239.177Z" transform="translate(-1177.972 -227.085)" fill="#499e43"/>
                        <path id="Path_10" data-name="Path 10" d="M1185.5,244.473c-.222-.042-.51-.087-.793-.151a.338.338,0,0,1-.249-.382.333.333,0,0,1,.366-.291c.294.038.587.09.877.153a.334.334,0,0,1,.238.387C1185.912,244.366,1185.763,244.479,1185.5,244.473Z" transform="translate(-1177.647 -226.732)" fill="#499e43"/>
                        <path id="Path_11" data-name="Path 11" d="M1188.682,234.2c0-.273.186-.458.394-.4a7.531,7.531,0,0,1,.859.289.334.334,0,0,1,.17.451.352.352,0,0,1-.448.184l-.708-.237C1188.785,234.424,1188.686,234.321,1188.682,234.2Z" transform="translate(-1177.337 -227.455)" fill="#499e43"/>
                        <path id="Path_12" data-name="Path 12" d="M1190.416,236.618a1.155,1.155,0,0,1-.209.288,7.1,7.1,0,0,1-.716.43.337.337,0,0,1-.469-.152.351.351,0,0,1,.158-.471,7.442,7.442,0,0,1,.643-.377.49.49,0,0,1,.364-.01C1190.281,236.368,1190.332,236.505,1190.416,236.618Z" transform="translate(-1177.315 -227.271)" fill="#499e43"/>
                        <path id="Path_13" data-name="Path 13" d="M1181.959,243.583a.481.481,0,0,1-.109-.024c-.248-.1-.5-.2-.738-.31a.345.345,0,0,1-.175-.478.352.352,0,0,1,.472-.152c.236.1.472.193.706.294a.346.346,0,0,1,.215.387A.353.353,0,0,1,1181.959,243.583Z" transform="translate(-1177.908 -226.809)" fill="#499e43"/>
                        <path id="Path_14" data-name="Path 14" d="M1187.592,238.01a.387.387,0,0,1-.353-.3.328.328,0,0,1,.207-.389c.281-.094.566-.177.853-.251a.334.334,0,0,1,.373.21.33.33,0,0,1-.137.42C1188.226,237.819,1187.906,237.908,1187.592,238.01Z" transform="translate(-1177.443 -227.214)" fill="#499e43"/>
                        <path id="Path_15" data-name="Path 15" d="M1185.827,238.4a.364.364,0,0,1-.407-.289.33.33,0,0,1,.24-.386c.275-.07.554-.132.834-.179a.328.328,0,0,1,.388.257.335.335,0,0,1-.26.42C1186.342,238.3,1186.058,238.353,1185.827,238.4Z" transform="translate(-1177.577 -227.179)" fill="#499e43"/>
                        <path id="Path_16" data-name="Path 16" d="M1183.693,244.115c-.238-.069-.555-.146-.862-.251a.322.322,0,0,1-.172-.392.318.318,0,0,1,.345-.25,8.391,8.391,0,0,1,.926.242.318.318,0,0,1,.18.385C1184.077,244,1183.937,244.111,1183.693,244.115Z" transform="translate(-1177.78 -226.763)" fill="#499e43"/>
                        <path id="Path_17" data-name="Path 17" d="M1191.063,235.4c-.04.2-.059.364-.1.516a.334.334,0,0,1-.409.23.323.323,0,0,1-.259-.37,1.311,1.311,0,0,0-.029-.682.311.311,0,0,1,.219-.379.323.323,0,0,1,.423.163A4.5,4.5,0,0,1,1191.063,235.4Z" transform="translate(-1177.222 -227.388)" fill="#499e43"/>
                        <path id="Path_18" data-name="Path 18" d="M1178.976,240.791a1.471,1.471,0,0,1,.242-.774.351.351,0,0,1,.5-.144.368.368,0,0,1,.1.5,1.578,1.578,0,0,0-.147.451c-.041.3-.158.453-.381.435S1178.964,241.077,1178.976,240.791Z" transform="translate(-1178.049 -227.012)" fill="#499e43"/>
                        <path id="Path_19" data-name="Path 19" d="M1183.872,233.955c-.136,0-.274.005-.41,0a.335.335,0,1,1,0-.671c.274-.006.548-.008.822,0a.325.325,0,0,1,.336.34.331.331,0,0,1-.339.338c-.136,0-.274,0-.411,0Z" transform="translate(-1177.744 -227.492)" fill="#499e43"/>
                        <path id="Path_20" data-name="Path 20" d="M1186.913,244.661c-.066-.007-.186-.018-.3-.036a.349.349,0,0,1,.079-.692c.113.006.225.02.337.035.261.036.391.173.375.386S1187.227,244.678,1186.913,244.661Z" transform="translate(-1177.51 -226.711)" fill="#499e43"/>
                        <path id="Path_21" data-name="Path 21" d="M1182.192,233.98a1.766,1.766,0,0,1-.283-.017.345.345,0,0,1,.039-.677,3.932,3.932,0,0,1,.464-.011.344.344,0,0,1,.013.686c-.076.006-.155,0-.232,0Z" transform="translate(-1177.853 -227.492)" fill="#499e43"/>
                      </g>
                    </g>
                  </g>
                </svg>
             </div>
            </li>
            {selectedDriver.type !== 'gps' && (
              <li className={`device-info-toggle  ${deviceInfo ? 'active' : ''}`} onClick={toggleDeviceInfo}>
                <div className="unhover_border">
                  <svg id="Group_31" data-name="Group 31" xmlns="http://www.w3.org/2000/svg" width="9.956" height="17.57" viewBox="0 0 9.956 17.57">
                    <g id="Group_30" data-name="Group 30">
                      <g id="Group_21" data-name="Group 21" transform="translate(3.221 0.878)">
                        <g id="Group_20" data-name="Group 20">
                          <path id="Path_22" data-name="Path 22" d="M1239.864,228.883h-2.928a.293.293,0,1,0,0,.586h2.928a.293.293,0,0,0,0-.586Z" transform="translate(-1236.643 -228.883)" fill="#499e43"/>
                        </g>
                      </g>
                      <g id="Group_23" data-name="Group 23" transform="translate(7.906 0.878)">
                        <g id="Group_22" data-name="Group 22">
                          <path id="Path_23" data-name="Path 23" d="M1241.594,228.883h-.293a.293.293,0,0,0,0,.586h.293a.293.293,0,1,0,0-.586Z" transform="translate(-1241.008 -228.883)" fill="#499e43"/>
                        </g>
                      </g>
                      <g id="Group_25" data-name="Group 25" transform="translate(3.806 14.935)">
                        <g id="Group_24" data-name="Group 24">
                          <path id="Path_24" data-name="Path 24" d="M1238.724,241.98H1238a.808.808,0,0,0-.808.807v.142a.809.809,0,0,0,.808.808h.727a.809.809,0,0,0,.808-.808v-.142A.808.808,0,0,0,1238.724,241.98Zm.221.949a.222.222,0,0,1-.221.222H1238a.223.223,0,0,1-.222-.222v-.142a.223.223,0,0,1,.222-.222h.727a.222.222,0,0,1,.222.222Z" transform="translate(-1237.188 -241.98)" fill="#499e43"/>
                        </g>
                      </g>
                      <g id="Group_27" data-name="Group 27">
                        <g id="Group_26" data-name="Group 26">
                          <path id="Path_25" data-name="Path 25" d="M1242.54,228.065h-7.84a1.059,1.059,0,0,0-1.058,1.058v15.454a1.059,1.059,0,0,0,1.058,1.058h7.84a1.06,1.06,0,0,0,1.058-1.058V229.123A1.059,1.059,0,0,0,1242.54,228.065Zm.472,16.512a.472.472,0,0,1-.472.472h-7.84a.473.473,0,0,1-.473-.472V229.123a.473.473,0,0,1,.473-.472h7.84a.472.472,0,0,1,.472.472v15.454Z" transform="translate(-1233.642 -228.065)" fill="#499e43"/>
                        </g>
                      </g>
                      <g id="Group_29" data-name="Group 29" transform="translate(0 1.757)">
                        <g id="Group_28" data-name="Group 28">
                          <path id="Path_26" data-name="Path 26" d="M1243.305,229.7h-9.371a.293.293,0,0,0-.292.293v12.3a.292.292,0,0,0,.292.293h9.371a.293.293,0,0,0,.293-.293V230A.293.293,0,0,0,1243.305,229.7Zm-.293,12.3h-8.785V230.288h8.785Z" transform="translate(-1233.642 -229.702)" fill="#499e43"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </li>)}

            {/* <li className={`time-line ${timelineInfo ? 'active': ''}`} onClick={this.fetchPoint}>
              <div className="unhover_border">
                <svg  id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                    width="14" height="18.78" viewBox="-1 2 16.59 16">
                <g>
                  <rect x="2.49" y="8.35"  width="7.49" height="0.7"/>
                  <polygon  points="9.19,10.44 2.49,10.44 2.49,11.14 8.57,11.14   "/>
                  <polygon points="7.32,12.52 2.49,12.52 2.49,13.22 6.69,13.22   "/>
                  <rect x="2.49" y="14.61" width="3.12" height="0.7"/>
                  <path d="M15.4,7.44l-0.88-0.98c-0.21-0.24-0.57-0.27-0.82-0.06c-0.02,0.02-0.04,0.04-0.06,0.06l-6.78,7.56V16
                    c1.5,0,1.12,0,1.75,0c0.33-0.36,1.76-1.97,3.24-3.61v5.01c0.02,0.36-0.26,0.68-0.62,0.7c0,0,0,0,0,0H1.24
                    c-0.37-0.02-0.65-0.33-0.63-0.7c0,0,0,0,0,0V4.87C0.6,4.5,0.88,4.19,1.24,4.17c0,0,0,0,0,0h1.25v1.39h7.49V4.17h1.25
                    c0.36,0.02,0.64,0.33,0.62,0.7c0,0,0,0,0,0v2.58l0.63-0.7V4.87c0.04-0.73-0.52-1.35-1.25-1.39H9.87c-0.18-0.61-0.64-1.1-1.24-1.31
                    c-0.3-0.1-0.52-0.35-0.59-0.66C7.86,0.52,6.91-0.15,5.92,0.02C5.16,0.16,4.57,0.75,4.43,1.51C4.36,1.82,4.14,2.07,3.84,2.17
                    c-0.6,0.21-1.07,0.7-1.24,1.31H1.24C0.52,3.52-0.04,4.14,0,4.87V17.4c-0.04,0.73,0.52,1.35,1.25,1.39h9.98
                    c0.73-0.04,1.29-0.66,1.25-1.39v-5.7l2.93-3.27C15.65,8.15,15.65,7.72,15.4,7.44z M3.11,4.16C3.1,3.57,3.46,3.04,4.02,2.84
                    c0.51-0.18,0.9-0.61,1.02-1.14c0.12-0.66,0.75-1.11,1.41-0.99C6.95,0.8,7.35,1.19,7.43,1.7c0.12,0.53,0.51,0.96,1.02,1.14
                    c0.56,0.21,0.92,0.74,0.9,1.34v0.7H3.11L3.11,4.16z M8.35,15.31H7.9l-0.42-0.46V14.3l0.42-0.47l0.88,0.98L8.35,15.31z M9.23,14.33
                    l-0.88-0.98l3.97-4.43L13.2,9.9L9.23,14.33z M13.64,9.41l-0.88-0.98l0.44-0.49l0.88,0.98L13.64,9.41z M14.52,8.42l-0.88-0.98
                    l0.44-0.49l0.88,0.98L14.52,8.42z" fill='#499E43'/>
                  <path  d="M6.25,1.57c-0.26,0-0.47,0.23-0.47,0.52s0.21,0.52,0.47,0.52s0.47-0.23,0.47-0.52S6.51,1.57,6.25,1.57z" fill='#499E43'/>
                </g>
                </svg>
               </div>
            </li> */}

            {/* <li className={`device-info-toggle ${nodeInfo ? 'active' : ''}`} onClick={this.toogleNodeData}>
              <div className="unhover_border">
                <svg  id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                    width="14" height="18.78" viewBox="-1 2 16.59 16">
                <g>
                  <rect x="2.49" y="8.35"  width="7.49" height="0.7"/>
                  <polygon  points="9.19,10.44 2.49,10.44 2.49,11.14 8.57,11.14   "/>
                  <polygon points="7.32,12.52 2.49,12.52 2.49,13.22 6.69,13.22   "/>
                  <rect x="2.49" y="14.61" width="3.12" height="0.7"/>
                  <path d="M15.4,7.44l-0.88-0.98c-0.21-0.24-0.57-0.27-0.82-0.06c-0.02,0.02-0.04,0.04-0.06,0.06l-6.78,7.56V16
                    c1.5,0,1.12,0,1.75,0c0.33-0.36,1.76-1.97,3.24-3.61v5.01c0.02,0.36-0.26,0.68-0.62,0.7c0,0,0,0,0,0H1.24
                    c-0.37-0.02-0.65-0.33-0.63-0.7c0,0,0,0,0,0V4.87C0.6,4.5,0.88,4.19,1.24,4.17c0,0,0,0,0,0h1.25v1.39h7.49V4.17h1.25
                    c0.36,0.02,0.64,0.33,0.62,0.7c0,0,0,0,0,0v2.58l0.63-0.7V4.87c0.04-0.73-0.52-1.35-1.25-1.39H9.87c-0.18-0.61-0.64-1.1-1.24-1.31
                    c-0.3-0.1-0.52-0.35-0.59-0.66C7.86,0.52,6.91-0.15,5.92,0.02C5.16,0.16,4.57,0.75,4.43,1.51C4.36,1.82,4.14,2.07,3.84,2.17
                    c-0.6,0.21-1.07,0.7-1.24,1.31H1.24C0.52,3.52-0.04,4.14,0,4.87V17.4c-0.04,0.73,0.52,1.35,1.25,1.39h9.98
                    c0.73-0.04,1.29-0.66,1.25-1.39v-5.7l2.93-3.27C15.65,8.15,15.65,7.72,15.4,7.44z M3.11,4.16C3.1,3.57,3.46,3.04,4.02,2.84
                    c0.51-0.18,0.9-0.61,1.02-1.14c0.12-0.66,0.75-1.11,1.41-0.99C6.95,0.8,7.35,1.19,7.43,1.7c0.12,0.53,0.51,0.96,1.02,1.14
                    c0.56,0.21,0.92,0.74,0.9,1.34v0.7H3.11L3.11,4.16z M8.35,15.31H7.9l-0.42-0.46V14.3l0.42-0.47l0.88,0.98L8.35,15.31z M9.23,14.33
                    l-0.88-0.98l3.97-4.43L13.2,9.9L9.23,14.33z M13.64,9.41l-0.88-0.98l0.44-0.49l0.88,0.98L13.64,9.41z M14.52,8.42l-0.88-0.98
                    l0.44-0.49l0.88,0.98L14.52,8.42z" fill='#499E43'/>
                  <path  d="M6.25,1.57c-0.26,0-0.47,0.23-0.47,0.52s0.21,0.52,0.47,0.52s0.47-0.23,0.47-0.52S6.51,1.57,6.25,1.57z" fill='#499E43'/>
                </g>
                </svg>
               </div>
            </li> */}

            {/* <li className={`${showTripTimeLine ? 'active': ''}`} onClick={this.toggleTripTimeLine}>
            <div className="unhover_border">
                <svg id="Group_18" data-name="Group 18" xmlns="http://www.w3.org/2000/svg" width="13.841" height="17.952" viewBox="0 0 13.841 17.952">
                  <g id="Group_17" data-name="Group 17">
                    <g id="Group_16" data-name="Group 16">
                      <g id="Group_15" data-name="Group 15">
                        <path id="Path_2" data-name="Path 2" d="M1180.648,234.392c-.673-.79-1.362-1.528-1.967-2.329a2.552,2.552,0,1,1,4.51-1.418,2.284,2.284,0,0,1-.375,1.033,10.075,10.075,0,0,1-.648.9C1181.683,233.172,1181.183,233.756,1180.648,234.392Zm.032-5.166a1.253,1.253,0,0,0-1.27,1.233,1.254,1.254,0,0,0,2.508.044A1.243,1.243,0,0,0,1180.681,229.227Z" transform="translate(-1178.112 -227.887)" fill="#499e43"/>
                        <path id="Path_3" data-name="Path 3" d="M1188.76,245c-.675-.792-1.37-1.527-1.969-2.333a2.554,2.554,0,1,1,4.512-1.877,2.292,2.292,0,0,1-.35,1.449,7.374,7.374,0,0,1-.6.847C1189.847,243.718,1189.321,244.334,1188.76,245Zm-1.233-3.914a1.254,1.254,0,0,0,1.262,1.256,1.269,1.269,0,0,0,1.247-1.259,1.255,1.255,0,0,0-2.51,0Z" transform="translate(-1177.518 -227.109)" fill="#499e43"/>
                        <path id="Path_4" data-name="Path 4" d="M1186.85,233.812a.342.342,0,0,1,.394-.355c.26.028.518.064.776.106a.351.351,0,0,1,.312.4.36.36,0,0,1-.438.289q-.352-.052-.705-.1A.347.347,0,0,1,1186.85,233.812Z" transform="translate(-1177.471 -227.479)" fill="#499e43"/>
                        <path id="Path_5" data-name="Path 5" d="M1180.669,242.347c0,.332-.293.521-.512.361a5.354,5.354,0,0,1-.7-.647.315.315,0,0,1,.049-.449.34.34,0,0,1,.469,0c.2.178.4.355.587.543A.678.678,0,0,1,1180.669,242.347Z" transform="translate(-1178.019 -226.888)" fill="#499e43"/>
                        <path id="Path_6" data-name="Path 6" d="M1185.515,233.311c.235.015.437.026.638.043a.35.35,0,1,1-.039.7q-.4-.014-.8-.054a.345.345,0,1,1,.038-.688C1185.418,233.31,1185.484,233.311,1185.515,233.311Z" transform="translate(-1177.608 -227.489)" fill="#499e43"/>
                        <path id="Path_7" data-name="Path 7" d="M1184.007,238.773c-.245,0-.386-.116-.417-.29a.337.337,0,0,1,.245-.384c.282-.069.568-.129.854-.177a.338.338,0,0,1,.371.266.322.322,0,0,1-.213.4C1184.552,238.668,1184.247,238.722,1184.007,238.773Z" transform="translate(-1177.711 -227.152)" fill="#499e43"/>
                        <path id="Path_8" data-name="Path 8" d="M1181.776,238.82a.3.3,0,0,1,.231-.3c.268-.076.538-.149.81-.206a.344.344,0,0,1,.423.262.349.349,0,0,1-.272.415c-.258.071-.516.138-.776.2A.347.347,0,0,1,1181.776,238.82Z" transform="translate(-1177.843 -227.123)" fill="#499e43"/>
                        <path id="Path_9" data-name="Path 9" d="M1181.45,239.177a.33.33,0,0,1-.214.319c-.239.105-.477.214-.717.317a.348.348,0,0,1-.456-.157.324.324,0,0,1,.126-.45,7.32,7.32,0,0,1,.829-.366A.333.333,0,0,1,1181.45,239.177Z" transform="translate(-1177.972 -227.085)" fill="#499e43"/>
                        <path id="Path_10" data-name="Path 10" d="M1185.5,244.473c-.222-.042-.51-.087-.793-.151a.338.338,0,0,1-.249-.382.333.333,0,0,1,.366-.291c.294.038.587.09.877.153a.334.334,0,0,1,.238.387C1185.912,244.366,1185.763,244.479,1185.5,244.473Z" transform="translate(-1177.647 -226.732)" fill="#499e43"/>
                        <path id="Path_11" data-name="Path 11" d="M1188.682,234.2c0-.273.186-.458.394-.4a7.531,7.531,0,0,1,.859.289.334.334,0,0,1,.17.451.352.352,0,0,1-.448.184l-.708-.237C1188.785,234.424,1188.686,234.321,1188.682,234.2Z" transform="translate(-1177.337 -227.455)" fill="#499e43"/>
                        <path id="Path_12" data-name="Path 12" d="M1190.416,236.618a1.155,1.155,0,0,1-.209.288,7.1,7.1,0,0,1-.716.43.337.337,0,0,1-.469-.152.351.351,0,0,1,.158-.471,7.442,7.442,0,0,1,.643-.377.49.49,0,0,1,.364-.01C1190.281,236.368,1190.332,236.505,1190.416,236.618Z" transform="translate(-1177.315 -227.271)" fill="#499e43"/>
                        <path id="Path_13" data-name="Path 13" d="M1181.959,243.583a.481.481,0,0,1-.109-.024c-.248-.1-.5-.2-.738-.31a.345.345,0,0,1-.175-.478.352.352,0,0,1,.472-.152c.236.1.472.193.706.294a.346.346,0,0,1,.215.387A.353.353,0,0,1,1181.959,243.583Z" transform="translate(-1177.908 -226.809)" fill="#499e43"/>
                        <path id="Path_14" data-name="Path 14" d="M1187.592,238.01a.387.387,0,0,1-.353-.3.328.328,0,0,1,.207-.389c.281-.094.566-.177.853-.251a.334.334,0,0,1,.373.21.33.33,0,0,1-.137.42C1188.226,237.819,1187.906,237.908,1187.592,238.01Z" transform="translate(-1177.443 -227.214)" fill="#499e43"/>
                        <path id="Path_15" data-name="Path 15" d="M1185.827,238.4a.364.364,0,0,1-.407-.289.33.33,0,0,1,.24-.386c.275-.07.554-.132.834-.179a.328.328,0,0,1,.388.257.335.335,0,0,1-.26.42C1186.342,238.3,1186.058,238.353,1185.827,238.4Z" transform="translate(-1177.577 -227.179)" fill="#499e43"/>
                        <path id="Path_16" data-name="Path 16" d="M1183.693,244.115c-.238-.069-.555-.146-.862-.251a.322.322,0,0,1-.172-.392.318.318,0,0,1,.345-.25,8.391,8.391,0,0,1,.926.242.318.318,0,0,1,.18.385C1184.077,244,1183.937,244.111,1183.693,244.115Z" transform="translate(-1177.78 -226.763)" fill="#499e43"/>
                        <path id="Path_17" data-name="Path 17" d="M1191.063,235.4c-.04.2-.059.364-.1.516a.334.334,0,0,1-.409.23.323.323,0,0,1-.259-.37,1.311,1.311,0,0,0-.029-.682.311.311,0,0,1,.219-.379.323.323,0,0,1,.423.163A4.5,4.5,0,0,1,1191.063,235.4Z" transform="translate(-1177.222 -227.388)" fill="#499e43"/>
                        <path id="Path_18" data-name="Path 18" d="M1178.976,240.791a1.471,1.471,0,0,1,.242-.774.351.351,0,0,1,.5-.144.368.368,0,0,1,.1.5,1.578,1.578,0,0,0-.147.451c-.041.3-.158.453-.381.435S1178.964,241.077,1178.976,240.791Z" transform="translate(-1178.049 -227.012)" fill="#499e43"/>
                        <path id="Path_19" data-name="Path 19" d="M1183.872,233.955c-.136,0-.274.005-.41,0a.335.335,0,1,1,0-.671c.274-.006.548-.008.822,0a.325.325,0,0,1,.336.34.331.331,0,0,1-.339.338c-.136,0-.274,0-.411,0Z" transform="translate(-1177.744 -227.492)" fill="#499e43"/>
                        <path id="Path_20" data-name="Path 20" d="M1186.913,244.661c-.066-.007-.186-.018-.3-.036a.349.349,0,0,1,.079-.692c.113.006.225.02.337.035.261.036.391.173.375.386S1187.227,244.678,1186.913,244.661Z" transform="translate(-1177.51 -226.711)" fill="#499e43"/>
                        <path id="Path_21" data-name="Path 21" d="M1182.192,233.98a1.766,1.766,0,0,1-.283-.017.345.345,0,0,1,.039-.677,3.932,3.932,0,0,1,.464-.011.344.344,0,0,1,.013.686c-.076.006-.155,0-.232,0Z" transform="translate(-1177.853 -227.492)" fill="#499e43"/>
                      </g>
                    </g>
                  </g>
                </svg>
             </div>
            </li> */}
            <li onClick={this.props.toggleStatisticsInfo}>
            <div className="unhover_border">
            <svg xmlns="http://www.w3.org/2000/svg" width="17.379" height="14.615" viewBox="0 0 17.379 14.615">
                <g id="statistics" transform="translate(0 -40.713)">
                  <g id="Group_367" data-name="Group 367" transform="translate(2.119 40.713)">
                    <g id="Group_366" data-name="Group 366">
                      <path id="Path_215" data-name="Path 215" d="M70.123,41.018a.508.508,0,0,0-.342-.156h0l-2.849-.149a.318.318,0,1,0-.033.635l2.181.114-6.507,4.6a.318.318,0,0,0,.368.519l6.592-4.663-.374,2.24a.318.318,0,0,0,.627.1l.47-2.813h0a.51.51,0,0,0-.131-.433Z" transform="translate(-62.438 -40.713)" fill="#499e43"/>
                    </g>
                  </g>
                  <g id="Group_369" data-name="Group 369" transform="translate(0.212 51.515)">
                    <g id="Group_368" data-name="Group 368">
                      <path id="Path_216" data-name="Path 216" d="M8.256,358.94H6.773a.53.53,0,0,0-.53.53v1.483a.53.53,0,0,0,.53.53H8.256a.53.53,0,0,0,.53-.53V359.47A.53.53,0,0,0,8.256,358.94Zm-.106,1.907H6.879v-1.271H8.15v1.271Z" transform="translate(-6.243 -358.94)" fill="#499e43"/>
                    </g>
                  </g>
                  <g id="Group_371" data-name="Group 371" transform="translate(3.815 49.396)">
                    <g id="Group_370" data-name="Group 370">
                      <path id="Path_217" data-name="Path 217" d="M114.4,296.526H112.92a.53.53,0,0,0-.53.53v3.6a.53.53,0,0,0,.53.53H114.4a.53.53,0,0,0,.53-.53v-3.6A.53.53,0,0,0,114.4,296.526Zm-.106,4.025h-1.272v-3.39H114.3Z" transform="translate(-112.39 -296.526)" fill="#499e43"/>
                    </g>
                  </g>
                  <g id="Group_373" data-name="Group 373" transform="translate(7.418 47.066)">
                    <g id="Group_372" data-name="Group 372">
                      <path id="Path_218" data-name="Path 218" d="M220.548,227.875h-1.484a.53.53,0,0,0-.53.53v5.932a.53.53,0,0,0,.53.53h1.484a.53.53,0,0,0,.53-.53V228.4A.53.53,0,0,0,220.548,227.875Zm-.106,6.355h-1.272v-5.72h1.272Z" transform="translate(-218.535 -227.875)" fill="#499e43"/>
                    </g>
                  </g>
                  <g id="Group_375" data-name="Group 375" transform="translate(11.021 44.524)">
                    <g id="Group_374" data-name="Group 374">
                      <path id="Path_219" data-name="Path 219" d="M326.7,152.973h-1.484a.53.53,0,0,0-.53.53v8.474a.53.53,0,0,0,.53.53H326.7a.53.53,0,0,0,.53-.53V153.5A.53.53,0,0,0,326.7,152.973Zm-.106,8.9h-1.272v-5.72h1.272Zm0-6.355h-1.272v-1.907h1.272Z" transform="translate(-324.682 -152.973)" fill="#499e43"/>
                    </g>
                  </g>
                  <g id="Group_377" data-name="Group 377" transform="translate(14.624 40.922)">
                    <g id="Group_376" data-name="Group 376">
                      <path id="Path_220" data-name="Path 220" d="M432.842,46.87h-1.484a.53.53,0,0,0-.53.53V59.475a.53.53,0,0,0,.53.53h1.484a.53.53,0,0,0,.53-.53V47.4A.53.53,0,0,0,432.842,46.87Zm-.106,12.5h-1.272V51.107h1.272Zm0-8.9h-1.272V47.506h1.272Z" transform="translate(-430.829 -46.87)" fill="#499e43"/>
                    </g>
                  </g>
                  <g id="Group_379" data-name="Group 379" transform="translate(0 54.693)">
                    <g id="Group_378" data-name="Group 378">
                      <path id="Path_221" data-name="Path 221" d="M17.061,452.561H.318a.318.318,0,1,0,0,.636H17.061a.318.318,0,1,0,0-.636Z" transform="translate(0 -452.561)" fill="#499e43"/>
                    </g>
                  </g>
                </g>
              </svg>
             </div>
            </li>
          </ul>
      </div>
    </div>
    );
  }
}

  export default Driver;