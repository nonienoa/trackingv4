import React from 'react';
import VanList from './vanList';
import agent from '../../agent';
import Modal from './modal';
import { reject, uniq } from 'lodash';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { ROUTE_NUMBER, SUCCESS_MESSAGE } from '../../constants/actionTypes';  
import moment from 'moment';

//import Images
import RouteListImg from '../../assets/images/icons/icon-route-list.svg';
import RouteListBlue from '../../assets/images/icons/icon-route-list-blue.svg';
import VanListImg from '../../assets/images/icons/icon-van-list.svg';
import VanListBlue from '../../assets/images/icons/icon-van-list-blue.svg';
import DateImg from '../../assets/images/icons/icon-date.svg';
import DateImgWhite from '../../assets/images/icons/icon-date-white.svg';


const mapDispatchToProps = dispatch => ({
	passRouteNumber: payload =>
        dispatch({ type: ROUTE_NUMBER, payload }),
    passSuccess:(payload) => 
        dispatch({ type: SUCCESS_MESSAGE, payload }),
})

const mapStateToProps = state => ({
    ...state.bestRoute
})

const color = [ '#5dd916c4','#137ac9c4','#e9ae36c4','#ff704bc4' ]

class RouteHistory extends React.Component {
    constructor() {
        super();
        this.state = {
            activeTab: 'routeList',
            vanList: [],
            startDate: new Date().getTime() - (1 * 24 * 60 * 60 * 1000),
            routeList: [],
            showCalendar: false,
            showModal: false,
            heading: 'Reset This Confirmed Route'
        }
        this.calendarRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    async componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        let routeList = await agent.BestRoute.routeHistory('');
        this.setState({
            routeList: routeList.data,
        })
        let vanList = await agent.BestRoute.vanHistory('')
        this.setState({
            vanList: uniq(vanList.data)
        })
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps){
        if(this.props.totalRouteHistory !== prevProps.totalRouteHistory){
            this.setState({
                routeList: this.props.totalRouteHistory
            })
        }
        if(this.props.totalVanList !== prevProps.totalVanList){
            this.setState({
                routeList: this.props.totalVanList
            })
        }
    }


    handleClickOutside(event) {
        if (this.calendarRef) {
            if(!this.calendarRef.current.contains(event.target)){
                this.setState({
                    showCalendar: false
                })
            }
        }
    }

    handleTabChange = async (tabName) => {
        this.setState({
            activeTab: tabName
        })
    }

    onDateChange = async (e) => {
        let date = moment(e).format('YYYY-MM-DD');
        let routeList = await agent.BestRoute.routeHistory(date);
        if(routeList.status===400 || routeList.status===401 || routeList.status===404 || routeList.status === 500){
            this.props.passSuccess('No Data Found')
            this.setState({
                routeList: [],
            })
        } else {
            this.setState({
                routeList: routeList.data,
            })
        }
        let vanList = await agent.BestRoute.vanHistory(date)
        if(vanList.status===400 || vanList.status===401 || vanList.status===404 || vanList.status === 500){
            this.props.passSuccess('No Data Found')
            this.setState({
                vanList: [],
            })
        } else {
            this.setState({
                vanList: uniq(vanList.data),
            })
        }
        this.setState({
            startDate: e
        })
    }

    toggleCalendar = () => {
        this.setState({
            showCalendar: !this.state.showCalendar
        })
    }

    openModal = (route) => {
        this.setState({
            showModal: true,
            selectedRoute: route
        })
    }

    closeModal = () => {
        this.setState({
            showModal: false,
        })
    }

    handleOk = async (heading) => {
        let res = await agent.BestRoute.resetConfirmRoute(this.state.selectedRoute.route);
        if(res.status===500|| res.status===400 || res.status===422 || res.status===404) {
            this.props.passSuccess("error")
        } else {
            this.props.passSuccess("success")
        }
        let date = moment(this.state.startDate).format('YYYY-MM-DD');
        let routeList = await agent.BestRoute.routeHistory(date);
        this.setState({
            routeList: routeList.data || [],
        })
        let vanList = await agent.BestRoute.vanHistory(date)
        this.setState({
            vanList: uniq(vanList.data) || []
        }) 
        this.closeModal();
    }

    render() {
        const { showHistory } = this.props;
        const { activeTab, vanList, routeList, startDate, showCalendar, showModal, heading } = this.state;
        return (
            <div className={`route-van-sec ${showHistory ? 'show' : ''}`}>
                <div className="route-van-head">
                    <div className="inner-route-van">
                        <button type="button" onClick={this.handleTabChange.bind(this, 'routeList')} className={`btn btn-rt-van icon-change ${activeTab === 'routeList' ? 'active' : ''}`}>
                            <img src={RouteListImg} className="icon-gray" alt="route" />
                            <img src={RouteListBlue} className="icon-white" alt="route" />
                            Route List
                        </button>
                        <button type="button" onClick={this.handleTabChange.bind(this, 'vanList')} className={`btn btn-rt-van icon-change ${activeTab === 'vanList' ? 'active' : ''}`}>
                            <img src={VanListImg} className="icon-gray" alt="van" />
                            <img src={VanListBlue} className="icon-white" alt="van" />
                            Van list
                        </button>
                        <div className="van-route-date-dv">
                            <button type="button" className={`btn btn-rt-date icon-change ${showCalendar?'active':''}`} onClick={this.toggleCalendar}>
                                <img src={DateImg} className="icon-gray" alt="calendar"/>
                                <img src={DateImgWhite} className="icon-white" alt="calendar"/>
                            </button>
                        </div>
                        <div style={{ position:"absolute", top: "30px", right:"0px" }} ref={this.calendarRef}>
                            {showCalendar?
                                <DatePicker
                                    selected={startDate}
                                    onChange={this.onDateChange}
                                    inline
                                />
                            :''}
                        </div>
                    </div>
                    {/* <!-- ends inner-route-van --> */}
                </div>
                {/* <!-- ends route-van-head --> */}
                <div className="route-van-body">
                    <VanList activeTab={activeTab} vanList={vanList} />
                    <div className="route-list-sec" style={{ display: `${activeTab === 'routeList' ? '' : 'none'}` }}>
                        <div className="route-detail-sec">
                            {routeList.length !== 0 ? routeList.map((route,Key)=>
                               <RouteItem 
                                route={route} 
                                key={Key} 
                                number={Key} 
                                routeNumber={this.props.routeNumber}
                                passRouteNumber={this.props.passRouteNumber}
                                openModal={this.openModal}
                                /> 
                            )
                            :""}
                        </div>
                    </div>
                </div>
                <Modal 
                    show={showModal}
                    handleClose={this.closeModal}
                    heading={heading}
                    handleOk={this.handleOk}
                />
                {/* <!-- ends route-van-body --> */}
                {/* {activeTab==='routeList'?
                <div className="btm-save-btn">
                    <div style={{ marginBottom: "5px" }}>
                        <input type="checkbox" onChange={this.hideDelivery} checked={this.props.hideDelivery}/> Hide Delivery Point
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                        <input type="checkbox" onChange={this.handleRadio} checked={this.props.showSelectedRoute}/> Hide Unselected Route
                    </div>
                </div>:''} */}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteHistory)

export class RouteItem extends React.Component {

    constructor() {
        super();
        this.state = {
            showRouteNumber: false
        }
    }

    loadRouteNumber = (route,color) => {
		if(!this.state.showRouteNumber) {
				route['color'] = color
				if(this.props.routeNumber.length===0){
					this.props.passRouteNumber([route])
				} else {
					this.props.passRouteNumber([...this.props.routeNumber, route])
				}
		} else {
			let index = reject(this.props.routeNumber, route)
			this.props.passRouteNumber(index)
		}
		this.setState({
			showRouteNumber: !this.state.showRouteNumber
		})
    }

    handleReset = (route) => {
        this.props.openModal(route)
    }
    
    render() {
        const { route, number } = this.props;
        const { showRouteNumber } = this.state;
        return (
            <div className="rut-dtl-item">
                <div className="rut-dtl-head">
                    <span className="spn-rut-dtl-dot"></span>
                    <div className="rut-head-title" style={{cursor: "pointer"}} onClick={this.loadRouteNumber.bind(this,route,color[number])}>
                        <h4 style={{ fontWeight: showRouteNumber? 700 : '' }}>{route.name} </h4>
                        <p style={{ fontWeight: showRouteNumber? 700 : '' }}>{route.total_delivery} Task</p>
                    </div>
                    <div className="right-head-btns">
                        <button className="btn-refresh" onClick={this.handleReset.bind(this,route)}>
                            <i className="fa fa-repeat" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                { showRouteNumber ?
                <div className="rut-dtl-body">
					{ route.delivery_list.length!==0?
						route.delivery_list.map( (delivery, Key) =>
							<div className="rut-bdy-item" key={Key}>
								<div className="rut-item-num">{delivery.position}<span className="num-dots" style={{backgroundColor:color[number]}}></span></div>
								<div className="rut-item-title">
									<h4>{delivery.location?delivery.location:'N/A'}</h4>
									{/* <p>Natasha Bradley</p> */}
									<span className="spn-color-line"></span>
								</div>
							</div>
						)
					:'' }
				</div>:''}
            </div>
        )
    }
}