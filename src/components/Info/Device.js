import React, {Component} from 'react';
import {includes, find, filter } from 'lodash';
import Cross from '../../assets/images/cross.svg';
import Signal from '../../assets/images/signal-tower.svg';
import Satellite from '../../assets/images/satellite.svg';
import ReactSpeedometer from "react-d3-speedometer";
import NoConnect from '../../assets/images/no-connection.svg';
import WeekConnect from '../../assets/images/week-connection.svg';
import AverageConnect from '../../assets/images/average-connection.svg';
import OkConnect from '../../assets/images/ok-connection.svg';
import GoodConnect from '../../assets/images/good-connection.svg';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import {Table} from 'react-bootstrap';

class Device extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      speed: 0,
      info: {
        av: null,
        ov: null,
        m: null,
        b: null,
        ssid: null,
        n: null,
      }
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props !== prevProps) {
      const {selectedDriver, activeList, activeMetas} = this.props
      if (includes(activeList, String(selectedDriver.id))) {
        let meta = find(activeMetas, ['userId', selectedDriver.id])
  
        if (meta !== undefined) {
          this.setState({info: meta.meta})
        }
      } else {
        this.setState({
          timer: null,
          speed: 0,
          info: {
            av: null,
            ov: null,
            m: null,
            b: null,
            ssid: null,
            n: null,
          }
        })
      }
    }
  }

  componentDidMount() {
    const {selectedDriver, activeList, activeMetas} = this.props;

    if (includes(activeList, String(selectedDriver.id))) {
      let meta = find(activeMetas, ['userId', selectedDriver.id])
      let timer = setInterval(this.getSpeed, 1000);

      if (meta !== undefined) {
        this.setState({info: meta.meta})
      }

      this.setState({timer})
    } else {
      this.setState({
        timer: null,
        speed: 0,
        info: {
          av: null,
          ov: null,
          m: null,
          b: null,
          ssid: null,
          n: null,
        }
      })
    } 
    // else {
      // let raw = restClient.service('raw')
      // raw
      //   .find({
      //     query: {
      //       $select: [ 'meta', 'speed' ],
      //       userId: selectedDriver.id,
      //       $sort: {
      //         ts: -1
      //       },
      //       $limit: 1,
      //     }
      //   })
      //   .then(res => {
      //     if (res.length !== 0) {
      //       this.setState({info: res[0].meta})
      //     }
      //   })
    // }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }


  getSpeed = async() => {
    const {geodata, selectedDriver} = this.props;

    const getInfo = filter(geodata.data.features, ['properties.userId', Number(selectedDriver.id)])[0]

    if (getInfo !== undefined) {
      this.setState({speed: Math.floor(getInfo.properties.speed * 3.6 * 100) / 100})
    }
  }

  render() {
    const {info} = this.state
    return (
      <div className="deviceinfo__wrapper">
        <div className={`device-info popup-list ${this.props.deviceInfo ? 'device-info-colapse' : ''}`}>
        <div>
          <h6 className="graph__header">Rider Status</h6>
        </div>
        <button className="cross device-info-toggle" onClick={this.props.toggleDeviceInfo}>
          <img src={Cross} alt="cross"/>
        </button>
        <div className="speedo__meter">
          <ReactSpeedometer
            maxValue={160}
            value={this.state.speed}
            needleColor="#8D8D8D"
            startColor="#5be171"
            segments={3000}
            maxSegmentLabels={8}
            endColor="#ff4942"
            // segmentColors={[
            //   "#5be171",
            //   "#ff4942"
            // ]}
          />
          <div className="whitecircle">
              <span>{this.state.speed}kmph</span>
          </div>
        </div>
        <div className="connetcion__stats">
          <div className="connetcion__stats--block">
            <img src={Signal} alt="signal"/>
            <div>
              <img className="no-connection-img" src={NoConnect} alt="connection-orange"/>
              <img className="week-connection-img" src={WeekConnect} alt="connection-orange"/>
              <img className="average-connection-img" src={AverageConnect} alt="connection-orange"/>
              <img className="ok-connection-img" src={OkConnect} alt="connection-orange"/>
              <img className="good-connection-img" src={GoodConnect} alt="connection-orange"/>
            </div>
            <span className="connection__stat__parcent">49%</span>
          </div>

          <div className={`connetcion__stats--block batteryindicator-progress ${Number(info.b) <= 30 ? 'low__battery' : ''} ${(Number(info.b) > 30 && Number(info.b) <= 70) ? 'average__battery' : ''}`}>
          <Progress percent={info.b} status="success" className="battery__indicator"/>
            <span className="connection__stat__parcent">{info.b}%</span>
          </div>

          <div className="connetcion__stats--block">
            <img src={Satellite} alt="satellite"/>
            <div>
            <img className="no-connection-img" src={NoConnect} alt="connection-orange"/>
              <img className="week-connection-img" src={WeekConnect} alt="connection-orange"/>
              <img className="average-connection-img" src={AverageConnect} alt="connection-orange"/>
              <img className="ok-connection-img" src={OkConnect} alt="connection-orange"/>
              <img className="good-connection-img" src={GoodConnect} alt="connection-orange"/>
            </div>
            <span className="connection__stat__parcent">100%</span>
          </div>

        </div>
        <div className="device__details">
          <div className="row no-gutters device__details-row">
            <Table borderless>
              <tbody>
                <tr>
                  <td className="relative__cell2"><span className="table__colon">:</span><span className="device__detail-name">App Ver</span></td>
                    <td><span className="device__detail-info">{info.av}</span></td>
                    <td className="relative__cell2"><span className="table__colon">:</span><span className="device__detail-name">Model</span></td>
                    <td><span className="device__detail-info">{info.m}</span></td>
                  </tr>
                  <tr>
                    <td className="relative__cell2"><span className="table__colon">:</span><span className="device__detail-name">OS</span></td>
                    <td><span className="device__detail-info">{info.ov}</span></td>
                    <td className="relative__cell2"><span className="table__colon">:</span><span className="device__detail-name">Network</span></td>
                    <td><span className="device__detail-info">{info.n}</span></td>
                  </tr>
                </tbody>
              </Table>
            </div>
        </div>
      </div>
      </div>
    );
  }
}

export default Device;