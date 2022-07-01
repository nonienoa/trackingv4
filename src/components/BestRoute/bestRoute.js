import React from 'react';

//import Component
import VanList from './vanList';
import RouteList from './routeList';
import agent from '../../agent';
import { SUCCESS_MESSAGE, SHOW_SELECTED_ROUTE, HIDE_DELIVERY } from '../../constants/actionTypes';
import { connect } from 'react-redux';

//import Images
import RouteListImg from '../../assets/images/icons/icon-route-list.svg';
import RouteListBlue from '../../assets/images/icons/icon-route-list-blue.svg';
import VanListImg from '../../assets/images/icons/icon-van-list.svg';
import VanListBlue from '../../assets/images/icons/icon-van-list-blue.svg';
import Loader from '../../assets/loader';

const mapDispatchToProps = dispatch => ({
    passSuccess:(payload) => 
        dispatch({ type: SUCCESS_MESSAGE, payload }),
    toggleSelectedRoute: (payload) =>
        dispatch({ type: SHOW_SELECTED_ROUTE, payload }),
    toggleHideDelivery: (payload) =>
        dispatch({ type: HIDE_DELIVERY, payload}),
})

const mapStateToProps = state => ({
    ...state.bestRoute,
})

class BestRoute extends React.Component {
    constructor() {
        super();
        this.state = {
            activeTab: 'routeList',
            vanList: [],
            routeList: [],
            unAssignedList: [],
            startAnalysis: false,
        }
    }

    async componentDidMount() {
        const { filterStation, filterDay, filterShift } = this.props;
        let routeList = await agent.BestRoute.routeList(filterDay, filterShift,  filterStation);
        this.setState({
            routeList: routeList.data,
            unAssignedList: routeList.unassigned
        })
        let vanList = await agent.BestRoute.vanList()
        this.setState({
            vanList: vanList.data
        })
    }

    handleTabChange = async (tabName) => {
        this.setState({
            activeTab: tabName
        })
        if(tabName==='vanList') {
            let vanList = await agent.BestRoute.vanList()
            this.setState({
                vanList: vanList.data
            })
        } 
        if(tabName==='routeList') {
            const { filterStation, filterDay, filterShift } = this.props;
            let routeList = await agent.BestRoute.routeList(filterDay, filterShift,  filterStation);
            this.setState({
                routeList: routeList.data,
                unAssignedList: routeList.unassigned
            })
        }  
       
    }

    reAnalysis = async () => {
        this.setState({
            startAnalysis: true
        })
        let res = await agent.BestRoute.reAnalysis();
        if(res.status===500) {
            this.props.passSuccess("error")
        } else {
            this.props.passSuccess("success")  
        }
        const { filterStation, filterDay, filterShift } = this.props;
        let routeList = await agent.BestRoute.routeList(filterDay, filterShift,  filterStation);
        let vanList = await agent.BestRoute.vanList()
        this.setState({
            routeList: routeList.data,
            unAssignedList: routeList.unassigned,
            vanList: vanList.data,
            startAnalysis: false
        })
    }

    handleRadio = (e) => {
        this.props.toggleSelectedRoute(e.target.checked)
    }

    hideDelivery = (e) => {
        this.props.toggleHideDelivery(e.target.checked)
    }

    render() {
        const { showRoute } = this.props;
        const { activeTab, vanList, routeList, unAssignedList, startAnalysis } = this.state;
        return(
            <div className={`route-van-sec ${showRoute?'show':''}`}>
                <div className="route-van-head">
                    <div className="inner-route-van">
                        <button type="button" onClick={this.handleTabChange.bind(this,'routeList')} className={`btn btn-rt-van icon-change ${activeTab === 'routeList'?'active':''}`}>
                            <img src={RouteListImg} className="icon-gray" alt="route" />
                            <img src={RouteListBlue} className="icon-white" alt="route" />
                            Route List
                        </button>
                        <button type="button" onClick={this.handleTabChange.bind(this,'vanList')} className={`btn btn-rt-van icon-change ${activeTab === 'vanList'?'active':''}`}>
                            <img src={VanListImg} className="icon-gray" alt="van" />
                            <img src={VanListBlue} className="icon-white" alt="van" />
                            Van list
                        </button>
                    </div>
                    {/* <!-- ends inner-route-van --> */}
                </div>
                {/* <!-- ends route-van-head --> */}
                <div className="route-van-body">
                    <VanList activeTab={activeTab} vanList={vanList} />
                    <RouteList activeTab={activeTab} vanList={vanList} routeList={routeList} unAssignedList={unAssignedList} passSuccess={this.props.passSuccess}/>
                    
                </div>
                {/* <!-- ends route-van-body --> */}
                {activeTab==='routeList'?
                <div className="btm-save-btn">
                    <div style={{ marginBottom: "5px" }}>
                        <input type="checkbox" onChange={this.hideDelivery} checked={this.props.hideDelivery}/> Hide Delivery Point
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                        <input type="checkbox" onChange={this.handleRadio} checked={this.props.showSelectedRoute}/> Hide Unselected Route
                    </div>
                    <button type="button" className={`btn btn-wide-txt w-100 ${startAnalysis?'':'active'}`} onClick={this.reAnalysis}>{startAnalysis?<Loader/>:'Save Changes'}</button>
                </div>:''}
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BestRoute);