import React from 'react';

//import Component
import { connect } from 'react-redux';
import { DELIVERY_POINT, TOTAL_DELIVERY, SELECTED_START_POINT, SUGGESTED_POINT, SELECTED_FILTER } from '../../constants/actionTypes';
import agent from '../../agent';
import moment from 'moment';
import { compact } from 'lodash';
import Select, { components } from 'react-select';
import createClass from "create-react-class";
import { colourOptions, shiftOptions } from './data';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

//import Images
import Dots from '../../assets/images/icons/icon-dots.svg';
import Shift from '../../assets/images/icons/icon-shift.svg';
import DateImg from '../../assets/images/icons/icon-date.svg';
import StartImg from '../../assets/images/start-point.svg'

const mapStateToProps = state => ({
    ...state.bestRoute
})

const mapDispatchToProps = dispatch => ({
    deliveryPoint: (payload) =>
        dispatch({ type: DELIVERY_POINT, payload }),
    allDeliveryPoint: (payload) =>
        dispatch({type: TOTAL_DELIVERY, payload}),
    selectStartPoint: (payload) => 
        dispatch({ type: SELECTED_START_POINT, payload }),
    suggestedPoint: (payload) =>
        dispatch({ type: SUGGESTED_POINT, payload }),
    passFilter: (payload) =>
        dispatch({ type: SELECTED_FILTER, payload })
})

const colourStyles = {
    option: (styles, state) => ({
        ...styles,
        cursor: 'pointer',
      }),
      control: (styles) => ({
        ...styles,
        cursor: 'pointer',
      }),
  };

class Bottom extends React.Component {
    constructor() {
        super();
        this.state = {
            dots: '',
            date: '',
            shift: '',
            today: '',
            tomorrow: '',
            yesterday: '',
            selectedDate: '',
            selectedDay: '"2020-09-06"',
            selectedShift: '',
            selectedShiftName:'All Shift',
            selectedStation:'',
            selectedStationName:'All',
            stationList: [],
            stationOptions: []
        }
    }

    async componentDidMount() {
        let stationList = await agent.BestRoute.getStation('','')
        if(stationList){
            let stationOptions = stationList.data.available.map((station, Key)=>{
                return { 
                    value: station,
                    label: station.name,
                    key: Key
                }
            })
            this.setState({
                today: moment().format('LL').split('').splice(0,6).join(''),
                tomorrow:  moment().add(1, 'days').format('LL').split('').splice(0,6).join(''),
                yesterday: moment().subtract(1, 'days').format('LL').split('').splice(0,6).join(''),
                selectedDate: '',
                stationList: stationList.data.available,
                stationOptions
            })
        }
        this.props.passFilter({
            selectedDay: moment().format('YYYY-MM-DD'),
            selectedShift: this.state.selectedShift,
            selectedStation: this.state.selectedStation
        })
        let deliveryPoint = await agent.BestRoute.getDeliveryPoint(moment().format('YYYY-MM-DD'), this.state.selectedShift, this.state.selectedStation)
        this.props.deliveryPoint(deliveryPoint.data)
    }

    handleDays = (name) => {
        this.setState({
            dots: name
        })
        let endTime = new Date();
        let filtered = this.props.allDeliveryPoints.map(point => {
            let startTime = `${point.order_date +' '+ point.order_time}`;
            var hours = moment
                    .duration(moment(endTime, 'YYYY/MM/DD HH:mm')
                    .diff(moment(startTime, 'YYYY/MM/DD HH:mm'))
                    ).asHours();
            if(name === "recentDay") {
                if(hours<24) {
                    return point
                }
            } else if(name === "day1") {
                if(hours>24 && hours<48) {
                    return point
                }
            } else if(name === "day2") {
                if(hours>48 && hours<72) {
                    return point
                }
            } else if(name === "day3") {
                if(hours>72) {
                    return point
                }
            } else if(name==="") {
                return point
            } 
            return null
        })
        this.props.deliveryPoint(compact(filtered))
    }
    
    handleMultiDayChange = async (e, option) => {
        let deliveryPoint;
        deliveryPoint = await agent.BestRoute.getDeliveryPoint(e?e.map(d=>d.value).join(","):'', this.state.selectedShift, this.state.selectedStation)
        if(this.state.selectedShift!==''){
            deliveryPoint.data.forEach(d=>d['isFiltered']='yes')
        }
        this.setState({
            selectedDay: e?e.map(d=>d.value).join(","):''
        })
        this.props.deliveryPoint(deliveryPoint.data)
        this.props.passFilter({
            selectedDay: e?e.map(d=>d.value).join(","):'',
            selectedShift: this.state.selectedShift,
            selectedStation: this.state.selectedStation
        })
    }

    handleMultiShiftChange = async (e, option) => {
        let deliveryPoint = await agent.BestRoute.getDeliveryPoint(this.state.selectedDay, e?e.map(d=>d.value).join(","):'', this.state.selectedStation)
        if(e) {
            deliveryPoint.data.forEach(d=>d['isFiltered']='yes')
        }
        this.setState({
            selectedShift: e?e.map(d=>d.value).join(","):''
        })
        this.props.deliveryPoint(deliveryPoint.data)
        this.props.passFilter({
            selectedDay: this.state.selectedDay,
            selectedShift: e?e.map(d=>d.value).join(","):'',
            selectedStation: this.state.selectedStation
        })
    }

    handleMultiStationChange = async (e, option) => {
        let deliveryPoint;
        let station;
        if(e) {
            station = e.map(d=>d.value.name).join(",")
            let map = e.map(d=>d.value)
            this.props.suggestedPoint({available:map, suggested:[]})
            deliveryPoint = await agent.BestRoute.getDeliveryPoint(this.state.selectedDay, this.state.selectedShift, station)
        } else {
            deliveryPoint = await agent.BestRoute.getDeliveryPoint(this.state.selectedDay,this.state.selectedShift,'')
            this.props.suggestedPoint({available:[], suggested:[]})
        }
        if(this.state.selectedShift!=='') {
            deliveryPoint.data.forEach(d=>d['isFiltered']='yes')
        }
        this.setState({
            selectedStation: e?station:''
        })
        this.props.deliveryPoint(deliveryPoint.data)
        this.props.passFilter({
            selectedDay: this.state.selectedDay,
            selectedShift: this.state.selectedShift,
            selectedStation: e?station:''
        })
    }

    render() {
        const {  dots, stationOptions } = this.state;
        const Option = createClass({
            render() {
              return (
                <div>
                  <components.Option {...this.props}>
                    <input
                      type="checkbox"
                      checked={this.props.isSelected}
                      onChange={e => null}
                    />{" "}
                    <label>{this.props.label} </label>
                  </components.Option>
                </div>
              );
            }
          });
        return( 
            <div className="btm-sec-wrap">
                <div className="btm-sec-left">
                    <div className="btm-item-list">
                        <div className="dots-groups">
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id={`tooltip-top`}>
                                    All Order
                                </Tooltip>
                            }
                            >
                            <button type="button" className={`btn btn-dots ${dots===''?'active':''}`} onClick={this.handleDays.bind(this,'')}><img src={Dots} alt="dots"/></button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id={`tooltip-top`}>
                                    Less than 24 hrs
                                </Tooltip>
                            }
                            >
                            <button type="button" className={`btn btn-dots ${dots==='recentDay'?'active':''}`} onClick={this.handleDays.bind(this,'recentDay')}><span className="dots-yellow"></span></button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id={`tooltip-top`}>
                                    Greater than 24 hrs and Less than 48 hrs
                                </Tooltip>
                            }
                            >
                            <button type="button" className={`btn btn-dots ${dots==='day1'?'active':''}`} onClick={this.handleDays.bind(this,'day1')}><span className="dots-blue"></span></button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id={`tooltip-top`}>
                                    Greater than 48 hrs and Less than 72 hrs
                                </Tooltip>
                            }
                            >
                            <button type="button" className={`btn btn-dots ${dots==='day2'?'active':''}`} onClick={this.handleDays.bind(this,'day2')}><span className="dots-orange"></span></button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id={`tooltip-top`}>
                                    Greater than 72 hrs
                                </Tooltip>
                            }
                            >
                            <button type="button" className={`btn btn-dots ${dots==='day3'?'active':''}`} onClick={this.handleDays.bind(this,'day3')}><span className="dots-red"></span></button>
                        </OverlayTrigger>
                        </div>
                        {/* <!-- ends dots-groups --> */}
                        {/* <!-- ends dots-groups --> */}
                    </div>
                    <div className="btm-item-list">
                        <div className="btm-item-date">
                            &nbsp;&nbsp;
                            <span className="spn-date"><img src={DateImg} alt="date" /></span>
                            &nbsp;&nbsp;
                                <Select
                                    isMulti
                                    name="colors"
                                    closeMenuOnSelect={false}
                                    components={{ Option, MultiValue }}
                                    hideSelectedOptions={false}
                                    options={colourOptions}
                                    className="basic-multi-select-day"
                                    placeholder="Select Day"
                                    classNamePrefix="SelectDay"
                                    menuPlacement="top"
                                    onChange={this.handleMultiDayChange}
                                    styles={colourStyles}
                                    defaultValue={colourOptions[1]}
                                />
                            &nbsp;&nbsp;
                        </div>
                        {/* <!-- ends-btm-item-date --> */}
                    </div>
                    {/* <!-- ends btm-item-list --> */}
                   
                    {/* <!-- ends btm-item-list --> */}
                    <div className="btm-item-list">
                        <div className="btm-item-date">
                            &nbsp;&nbsp;
                            <span className="spn-date"><img src={Shift} alt="date" /></span>
                            &nbsp;&nbsp;
                            <Select
                                isMulti
                                name="colors"
                                closeMenuOnSelect={false}
                                components={{ Option, MultiValue }}
                                hideSelectedOptions={false}
                                options={shiftOptions}
                                className="basic-multi-select-shift"
                                placeholder="Select Shift"
                                classNamePrefix="SelectDay"
                                menuPlacement="top"
                                onChange={this.handleMultiShiftChange}
                                styles={colourStyles}
                                />
                            &nbsp;&nbsp;
                        </div>
                        {/* <!-- ends-btm-item-date --> */}
                    </div>

                    <div className="btm-item-list">
                        <div className="btm-item-date">
                            &nbsp;&nbsp;
                            <span className="spn-date"><img src={StartImg} alt="date" /></span>
                            &nbsp;&nbsp;
                            <Select
                                isMulti
                                name="colors"
                                closeMenuOnSelect={false}
                                components={{ Option, MultiValue }}
                                hideSelectedOptions={false}
                                options={stationOptions}
                                className="basic-multi-select"
                                placeholder="Select Station"
                                classNamePrefix="SelectDay"
                                menuPlacement="top"
                                onChange={this.handleMultiStationChange}
                                styles={colourStyles}
                            />
                            &nbsp;&nbsp;
                        </div>
                        {/* <!-- ends-btm-item-date --> */}
                    </div>

                </div>
                {/* <!-- ends-btm-sec-left --> */}
            </div> 
        )
    }
}

const MultiValue = props => {
    let label = props.data.label
    if(props.data.value==="evening"){
        label="Evening"
    }
    if(props.data.value==="afternoon"){
        label="Afternoon"
    }
    if(props.data.value==="morning"){
        label="Morning"
    }
    if(props.data.value==="early-morning"){
        label="Early Morning"
    }
    if(props.data.value===moment().subtract(1, 'days').format('YYYY-MM-DD')){
        label="Yesterday"
    }
    if(props.data.value===moment().format('YYYY-MM-DD')){
        label="Today"
    }
    if(props.data.value===moment().add(1, 'days').format('YYYY-MM-DD')){
        label="Tomorrow"
    }
    return (
      <components.MultiValue {...props}>
        <span>{label}</span>
      </components.MultiValue>
    );
  };

export default connect(mapStateToProps, mapDispatchToProps)(Bottom);