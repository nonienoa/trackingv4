import React from 'react';

//import Component
import CreateArea from './createArea';
import BestRoute from './bestRoute';
import SuggestPoint from './suggestPoint';
import ConfirmModal from './modal';
import RouteHistory from './routeHistory';
import agent from '../../agent';
import {uniq} from 'lodash';
import { connect } from 'react-redux';
import { 
    DELIVERY_POINT, 
    SUGGEST_POINT, 
    ROUTE_DISPLAY, 
    TOTAL_DELIVERY, 
    CUSTOM_POLYGON, 
    PRELOAD_POLYGON, 
    SUCCESS_MESSAGE, 
    ROUTE_LIST,
    SUGGESTED_POINT,
    HIDE_DELIVERY,
    SHOW_SELECTED_ROUTE,    
    ROUTE_HISTORY,
    VAN_HISTORY
} from '../../constants/actionTypes';

//import Images
import Analysis from '../../assets/images/icons/icon-analysis.svg';
import AnalysisWhite from '../../assets/images/icons/icon-analysis-white.svg';
import Area from '../../assets/images/icons/icon-area.svg';
import AreaWhite from '../../assets/images/icons/icon-area-white.svg';
import GPS from '../../assets/images/icons/icon-gps.svg';
import GPSWhite from '../../assets/images/icons/icon-gps-white.svg';
import Sync from '../../assets/images/icons/icon-sync.svg';
import RemovePath from '../../assets/images/removePath.svg';
import Marker from '../../assets/images/icons/icon-rt-marker.svg';
import MarkerWhite from '../../assets/images/icons/icon-rt-marker-white.svg';
// import SyncWhite from '../../assets/images/icons/icon-sync-white.svg';
import Loader from '../../assets/loader';

const mapDispatchToProps = dispatch =>({
    deliveryPoint: (payload) =>
        dispatch({type: DELIVERY_POINT, payload}),
    allDeliveryPoint: (payload) =>
        dispatch({type: TOTAL_DELIVERY, payload}),
    enableSuggestPoint: (payload) =>
        dispatch({ type: SUGGEST_POINT, payload }),
    routeDisplay: (payload) =>
        dispatch({ type: ROUTE_DISPLAY, payload }),
    resetCustomArea: () =>
        dispatch({ type: CUSTOM_POLYGON, payload:[] }),
    resetFixedArea: () =>
        dispatch({ type: PRELOAD_POLYGON, payload:[] }),
    passSuccess:(payload) => 
        dispatch({ type: SUCCESS_MESSAGE, payload }),
    passRouteList: payload =>
        dispatch ({ type: ROUTE_LIST, payload }),
    passStation: (payload) =>
        dispatch({ type: SUGGESTED_POINT, payload }),
    toggleHideDelivery: (payload) =>
        dispatch({ type: HIDE_DELIVERY, payload}),
    toggleSelectedRoute: (payload) =>
        dispatch({ type: SHOW_SELECTED_ROUTE, payload }),
    passRouteHistory: (payload) => 
        dispatch({ type: ROUTE_HISTORY, payload  }),
    passVanHistory: (payload) =>
        dispatch({ type: VAN_HISTORY, payload })
})

const mapStateToProps = state => ({
	filterDay: state.bestRoute.filterDay,
	filterShift: state.bestRoute.filterShift,
	filterStation: state.bestRoute.filterStation
})

class SideBar extends React.Component{
    constructor() {
        super();
        this.state = {
            showArea: false,
            showAnalysis: false,
            showRoute: false,
            showHistory: false,
            startSync: false,
            startReset: false,
            showModal: false,
            heading: ''
        }
    }

    componentDidMount() {
        this.showAnalysis()
    }

    showAnalysis = async () => {
        const delivery = await agent.BestRoute.getDeliveryPoint('','','');
        // this.props.deliveryPoint(delivery.data)
        this.props.allDeliveryPoint(delivery.data)
        this.setState({
            showAnalysis: !this.state.showAnalysis,
            showArea: false,
            showRoute: false,
            showHistory: false,
        })
        this.props.routeDisplay({})
        this.props.resetCustomArea()
        this.props.resetFixedArea()
        this.props.toggleHideDelivery(false)
        this.props.enableSuggestPoint(false);
    }

    showArea = () => {
        this.setState({
            showArea: !this.state.showArea,
            showAnalysis: false,
            showRoute: false,
            showHistory: false,
        })
        this.props.routeDisplay({})
        this.props.toggleHideDelivery(false)
        this.props.enableSuggestPoint(false);
    }

    showRoute = async () => {
        this.setState({
            showRoute: !this.state.showRoute,
            showArea: false,
            showAnalysis: false,
            showHistory: false
        })
        const { filterStation, filterDay, filterShift } = this.props;
        let routeList = await agent.BestRoute.routeList(filterDay, filterShift,  filterStation);
        // console.log(routeList)
        this.props.passRouteList(routeList)
        let allRoute = await agent.BestRoute.getAllRoute();
        console.log(allRoute)
        this.props.routeDisplay(allRoute)
        this.props.enableSuggestPoint(false);
        this.props.resetCustomArea()
        this.props.resetFixedArea()
        let stationList = await agent.BestRoute.getStation('','')
        this.props.passStation(stationList.data)
    }

    routeHistory = async () => {
        this.setState({
            showHistory: !this.state.showHistory,
            showRoute: false,
            showArea: false,
            showAnalysis: false
        })
        let allRoute = await agent.BestRoute.getAllRoute();
        this.props.routeDisplay(allRoute)
        let routeList = await agent.BestRoute.routeHistory('');
        this.props.passRouteHistory(routeList.data)
        let vanList = await agent.BestRoute.vanHistory('')
        this.props.passVanHistory(uniq(vanList.data))
        this.props.resetCustomArea()
        this.props.resetFixedArea()
        this.props.toggleHideDelivery(true)
        this.props.toggleSelectedRoute(true)
        this.props.enableSuggestPoint(false);
    }

   syncData = async () => {
       this.setState({
           showModal: true,
           heading: "Sync Data"
       })
   }

   resetData = async () => {
      this.setState({
          showModal: true,
          heading: "Reset Route"
      })
   }

   handleClose = () => {
       this.setState({
           showModal: false,
       })
   }

   handleOk = async (heading) => {
       if(heading==="Sync Data") {
            this.setState({
                startSync: true
            })
            let res = await agent.BestRoute.syncData()
            if(res.status===500|| res.status===400 || res.status===422 || res.status===404) {
                this.props.passSuccess("error")
            } else {
                this.props.passSuccess("success")
            }
            this.setState({
                startSync: false,
                showModal: false
            }) 
       }
       if(heading === "Reset Route") {
            this.setState({
                startReset: true
            })
            let res = await agent.BestRoute.routeReset()
            const { filterStation, filterDay, filterShift } = this.props;
            let routeList = await agent.BestRoute.routeList(filterDay, filterShift,  filterStation);
            this.props.passRouteList(routeList)
            let allRoute = await agent.BestRoute.getAllRoute();
            this.props.routeDisplay({})
            window.setTimeout(()=>{
                this.props.routeDisplay(allRoute)
            },200)
            this.props.routeDisplay(allRoute)
            if(res.status===500|| res.status===400 || res.status===422 || res.status===404) {
                this.props.passSuccess("error")
            } else {
                this.props.passSuccess("success")
            }
            this.setState({
                startReset: false,
                showModal: false
            })
       }
   }

    render() {
        const { showArea, showAnalysis, showRoute, showHistory, startSync, startReset, showModal, heading } = this.state;
        return(
            <>            
            <div className="left-small-sec">
                <div className="left-small-upper">
                    <button type="button" onClick={this.showAnalysis} className={`btn btn-lft-sml icon-change ${showAnalysis?'active':''}`}>
                        <img src={Analysis} className="icon-gray" alt="analysis" />
                        <img src={AnalysisWhite} className="icon-white" alt="analysis" />
                    </button>
                    <button type="button" onClick={this.showArea} className={`btn btn-lft-sml icon-change ${showArea?'active':''}`}>
                        <img src={Area} className="icon-gray" alt="area" />
                        <img src={AreaWhite} className="icon-white" alt="area" />
                    </button>
                    <button type="button" onClick={this.showRoute} className={`btn btn-lft-sml icon-change ${showRoute?'active':''}`}>
                        <img src={GPS} className="icon-gray" alt="gps" />
                        <img src={GPSWhite} className="icon-white" alt="gps" />
                    </button>
                    <button type="button" className={`btn btn-lft-sml icon-change ${showHistory?'active': ''}`} onClick={this.routeHistory}>
                        <img src={Marker} className="icon-gray" alt="marker" />
                        <img src={MarkerWhite} className="icon-white" alt="marker" />
                    </button>
                </div>
                {/* <!-- ends left-small-upper --> */}
                <div className="left-small-lower">
                    <button type="button" className={`btn btn-lft-sml icon-change ${startReset?'active':''}`} onClick={this.resetData}>
                        <img src={RemovePath} className="icon-gray" alt="sync" />
                        {startReset?<Loader /> :''}
                    </button>
                    <button type="button" className={`btn btn-lft-sml icon-change ${startSync?'active':''}`} onClick={this.syncData}>
                        <img src={Sync} className="icon-gray" alt="sync" />
                        {startSync?<Loader /> :''}
                    </button>
                </div>
                {/* <!-- ends left-small-lower --> */}
            </div>
            {/* <!-- ends left-small-sec --> */}
            
            <ConfirmModal
                show={showModal}
                handleOk = {this.handleOk}
                handleClose = {this.handleClose}
                heading = {heading}
            />
            <SuggestPoint />
            <CreateArea showArea={showArea} />
            <BestRoute showRoute={showRoute} />
            <RouteHistory showHistory={showHistory} />
            {/* <!-- ends left-wide-sec --> */} 
        </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)