import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { isEmpty, find, filter } from 'lodash';
import { SUGGEST_POINT,SUCCESS_MESSAGE, CUSTOM_AREA, ALREADY_SELECTED_POLYGON, SELECTED_FIXED_POLYGON, PRELOAD_POLYGON, CUSTOM_POLYGON, SELECTED_START_POINT  } from '../../constants/actionTypes';
import agent from '../../agent';
import Close from '../../assets/images/close.svg';
import Loader from '../../assets/loader';

const mapStateToProps = state => ({
    ...state.bestRoute,
})

const mapDispatchToProps = dispatch =>({
    enableSuggestPoint: (payload) =>
        dispatch({ type: SUGGEST_POINT, payload }),
    passSuccess:(payload) => 
        dispatch({ type: SUCCESS_MESSAGE, payload }),
    customAreaData:(payload) =>
        dispatch({ type: CUSTOM_AREA, payload }),
    passAlreadySelected: (payload) => 
        dispatch({ type: ALREADY_SELECTED_POLYGON, payload }),
    selectFixedPolygon: (payload) =>
        dispatch({ type: SELECTED_FIXED_POLYGON, payload }),
    preloadPolygon: (payload) =>
        dispatch({ type: PRELOAD_POLYGON, payload }),
    customPolygon: (payload) =>
        dispatch({ type: CUSTOM_POLYGON, payload }),    
    selectStartPoint: (payload) => 
        dispatch({ type: SELECTED_START_POINT, payload })
})

class SuggestPoint extends React.Component{
    constructor() {
        super();
        this.state = {
            stationList:[],
            isSelected:[],
            startAnalysis: false,
            startReset: false,
        }
    }

    componentDidUpdate(prevProps) {
        // if(this.props.selectedStation !== prevProps.selectedStation ) {
        //     if(this.props.selectedStation !== '' && this.props.selectedStation) {
        //         let find1 = find(this.props.suggestedPoints.suggested,['name', this.props.selectedStation])
        //         let find2 = find(this.props.suggestedPoints.available,['name', this.props.selectedStation])
        //         this.setState({
        //             isSelected: find1?find1.station_id: find2.station_id
        //         })
        //         this.props.selectStartPoint({})
        //         window.setTimeout(() => {
        //             this.props.selectStartPoint(find1?find1: find2)
        //         },200
        //         )
        //     } else {
        //         this.props.selectStartPoint({})
        //     }
        // }
        if(this.props.suggestedPoints !== prevProps.suggestedPoints){
            if(!isEmpty(this.props.suggestedPoints)){
                this.setState({
                    isSelected: this.props.suggestedPoints.available
                })
            }
        }
    }

    setSelected = (id) => {
        let selectedId = this.state.isSelected;
        if(find(selectedId,['station_id', id.station_id])===undefined){
            selectedId.push(id);
            this.setState({
                isSelected: selectedId
            })
        } else {
            let removed = filter(selectedId, (d) => d!==id);
            this.setState({
                isSelected: removed,
            })
        }
    }

    setStationVan = (van) => {
        this.setState({
            isSelected: van,
        })
    }

    resetArea = async () => {
        this.setState({
            startReset: true
        })
        await agent.BestRoute.resetArea(this.props.preloadPolygons.length!==0?'fixed':'custom',this.props.preloadPolygons.length!==0?this.props.alreadySelectedPolygon.join(','):this.props.selectedPolygon.id)
        this.setState({
            startReset: false
        })
        let customArea = await agent.BestRoute.getArea('custom');
        this.props.customAreaData(customArea.data)
        this.props.passAlreadySelected([])
        this.props.selectFixedPolygon([])
        this.props.preloadPolygon([])
        this.props.customPolygon([])
        this.props.enableSuggestPoint(false)
        this.props.passSuccess("success")
    }

    startAnalysis = async () => {
        this.setState({
            startAnalysis: true
        })
        let data = this.state.isSelected.map(select =>{
            return `${select.name}:${select.vans}`
        })
        let res = await agent.BestRoute.startAnalysis(this.props.preloadPolygons.length!==0?'fixed':'custom',this.props.preloadPolygons.length!==0?this.props.alreadySelectedPolygon.join(','):this.props.selectedPolygon.id, data.join(","), this.props.filterDay, this.props.filterShift)
        this.setState({
            startAnalysis: false
        })
        if(res.status===500|| res.status===400 || res.status===422 || res.status===404) {
            this.props.passSuccess("error")
        } else {
            this.props.passSuccess("success")
            }
        this.props.preloadPolygon([])
        this.props.customPolygon([])
        this.props.enableSuggestPoint(false)
    }

    handleClose = () => {
        this.props.enableSuggestPoint(false)
    }

    render() {
        const { suggestPoint, suggestedPoints, selectedPolygon, selectedFixedPolygon, vanNumber } = this.props;
        const { isSelected, startAnalysis, startReset } = this.state;
        return (
            <div className={`right-suggested-sec ${suggestPoint ?'show':''}`}>
                <div style={{position:'absolute',top:"0px",right:"20px", cursor:"pointer"}} onClick={this.handleClose}><img src={Close} height="10px" width="10px" alt="close" /></div>
                {/* <div className="sgst-head">
                    <h2>Suggested StartPoint</h2>
                </div>
                <div className="sgst-dtl">
                    { !isEmpty(suggestedPoints) && suggestedPoints.suggested.map( (suggest, Key) => 
                        <AvailablePoint 
                            suggest={suggest} 
                            key={Key} 
                            selectedPolygon={selectedPolygon} 
                            selectedFixedPolygon={selectedFixedPolygon} 
                            selectFixedPolygon={this.props.selectFixedPolygon}
                            setSelected={this.setSelected} 
                            isSelected={isSelected} 
                            passSuccess={this.props.passSuccess} 
                            customAreaData={this.props.customAreaData}
                            startAnalysis={startAnalysis}
                            passAlreadySelected={this.props.passAlreadySelected}
                            alreadySelectedPolygon = {this.props.alreadySelectedPolygon}
                            selectStartPoint = { this.props.selectStartPoint }
                            preloadPolygon = {this.props.preloadPolygon}
                            preloadPolygons = {this.props.preloadPolygons}
                            vanNumber={vanNumber}
                            /> 
                    ) }
                </div> */}
                {/* <!-- ends sgst-dtl --> */}

                <div className="sgst-head">
                    <h2>Available StartPoint</h2>
                </div>
                {/* <!-- ends sgst-head --> */}
                <div className="sgst-dtl">
                    {!isEmpty(suggestedPoints) ? suggestedPoints.available.map((station, Key) =>{
                        station.vans = 1;
                        return <SgstPoint 
                            station={station} 
                            key={Key} 
                            selectedPolygon={selectedPolygon} 
                            selectedFixedPolygon={selectedFixedPolygon} 
                            selectFixedPolygon={this.props.selectFixedPolygon}
                            setSelected={this.setSelected} 
                            setStationVan={this.setStationVan}
                            isSelected={isSelected} 
                            passSuccess={this.props.passSuccess} 
                            customAreaData={this.props.customAreaData}
                            startAnalysis={startAnalysis}
                            passAlreadySelected={this.props.passAlreadySelected}
                            alreadySelectedPolygon={this.props.alreadySelectedPolygon}
                            selectStartPoint = { this.props.selectStartPoint }
                            preloadPolygon = {this.props.preloadPolygon}
                            preloadPolygons = {this.props.preloadPolygons}
                            vanNumber={vanNumber}
                        />
                    }
                    ):''}
                </div>
                {/* <!-- ends sgst-dtl --> */}
                <div className="btm-save-btn"><button type="button" className={`btn btn-wide-txt w-100 ${startAnalysis?'':'active'}`} onClick={this.startAnalysis}>{startAnalysis?<Loader/>:'Start Analysis'}</button></div>
                <div style={{padding:'0px 18px'}}><button type="button" className="btn btn-wide-txt w-100 active" style={{background:"#ff1a1a"}} onClick={this.resetArea}>{startReset?<Loader/>:'Reset Area'}</button></div>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SuggestPoint);

export class SgstPoint extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedVan: '1 Van',
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.vanNumber !== prevProps.vanNumber){
            this.setState({
                selectedVan:  '1 Van',
            })
        }
    }

    handleClick = (id, station) => {
        this.props.setSelected(id)
    }

    handleChange= async (station, e) => {
        let van = e.split('').splice(0,1).join('');
        let assignVan = this.props.isSelected.map(st => {
            if(st === station){
                st["vans"] = parseInt(van);
                return {...st}
            } else {
                return st
            }
        })
        this.props.passAlreadySelected([...this.props.alreadySelectedPolygon,...this.props.selectedFixedPolygon])
        // await agent.BestRoute.assignVan(this.props.selectedFixedPolygon.length!==0?'fixed':'custom', this.props.selectedFixedPolygon.length!==0?this.props.selectedFixedPolygon.join(","):this.props.selectedPolygon.id, van )
        this.setState({
            selectedVan: e,
        })
        this.props.selectFixedPolygon([])
        // if(this.props.preloadPolygons.length!==0){
        //         let preloadArea1 = await agent.BestRoute.getArea('fixed');
        //         this.props.preloadPolygon(preloadArea1.data)
        //     } else {
        //             let customArea = await agent.BestRoute.getArea('custom');
        //             this.props.customAreaData(customArea.data)
        //         }
        this.props.setStationVan(assignVan);
    }

    render(){
        const { selectedVan } = this.state;
        const { station, isSelected, startAnalysis } = this.props
        return(
        <div className="sgst-dtl-item">
            <div className="sgst-item-upper">
                <span className="sgst-dots"></span>
                <div className="points-name">
                    <h3>{station.name}</h3>
                    {/* <p>7km away</p> */}
                </div>
                <button type="button" onClick={this.handleClick.bind(this,station, station)} className={`btn btn-point ${find(isSelected,['station_id', station.station_id])?'active':''}`} disabled={startAnalysis}></button>
            </div>
            <div className="sgst-item-lower" style={{display: `${find(isSelected,['station_id', station.station_id]) ?'':"none"}`}}>
                <h4>Number of Van</h4>
                <div className="assign-drop">
                    <div className="dropdown">
                    <Dropdown onSelect={this.handleChange.bind(this, station)} >
                        <Dropdown.Toggle id="dropdownMenuButton" className="btn dropdown-toggle" disabled={startAnalysis}>
                            {selectedVan}<i className="fa fa-chevron-down" aria-hidden="true"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu">
                            <Dropdown.Item eventKey="1 Van">
                                1 Van
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="2 Vans">
                                2 Vans
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="3 Vans">
                                3 Vans
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="4 Vans">
                                4 Vans
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>{' '}
                    </div>
                </div>
            </div>                                
        </div>  
        )
    }
}

// export class AvailablePoint extends React.Component{
//     constructor(props) {
//         super(props);
//         this.state = {
//             buttonClicked: false,
//             selectedVan:  'No Van',
//         }
//     }

//     componentDidUpdate(prevProps) {
//         if(this.props.vanNumber !== prevProps.vanNumber){
//             this.setState({
//                 selectedVan:  this.props.vanNumber!=='' & this.props.vanNumber ?this.props.vanNumber+' van':'No Van',
//             })
//         }
//     }

//     handleClick = (id, station) => {
//         this.props.setSelected(id)
//     }

//     handleChange = async (e) => {
//         let van = e.split('').splice(0,1).join('');
//         this.props.passAlreadySelected([...this.props.alreadySelectedPolygon,...this.props.selectedFixedPolygon])
//         await agent.BestRoute.assignVan(this.props.selectedFixedPolygon.length!==0?'fixed':'custom',this.props.selectedFixedPolygon.length!==0?this.props.selectedFixedPolygon.join(','):this.props.selectedPolygon.id, van )
//         this.setState({
//             selectedVan: e
//         })
//         this.props.selectFixedPolygon([])
//         if(this.props.preloadPolygons.length!==0){
//             let preloadArea1 = await agent.BestRoute.getArea('fixed');
//             this.props.preloadPolygon(preloadArea1.data)
//         } else {
//             let customArea = await agent.BestRoute.getArea('custom');
//             this.props.customAreaData(customArea.data)
//         }
//         this.props.passSuccess("success")
//     }

//     render(){
//         const { selectedVan } = this.state;
//         const { isSelected, suggest, startAnalysis } = this.props;
//         return(
//         <div className="sgst-dtl-item">
//             <div className="sgst-item-upper">
//                 <span className="sgst-dots"></span>
//                 <div className="points-name">
//                     <h3>{suggest.name}</h3>
//                     {/* <p>2km away</p> */}
//                 </div>
//                 <button type="button" onClick={this.handleClick.bind(this,suggest.station_id, suggest)}  className={`btn btn-point ${suggest.station_id===parseInt(isSelected)?'active':''}`} disabled={startAnalysis}></button>
//             </div>
//             <div className="sgst-item-lower" style={{display: `${suggest.station_id===parseInt(isSelected)?'':"none"}`}}>
//                 <h4>Number of Van</h4>
//                 <div className="assign-drop">
//                     <div className="dropdown">
//                     <Dropdown onSelect={this.handleChange}>
//                         <Dropdown.Toggle id="dropdownMenuButton" className="btn dropdown-toggle" disabled={startAnalysis}>
//                             {selectedVan}<i className="fa fa-chevron-down" aria-hidden="true"></i>
//                         </Dropdown.Toggle>
//                         <Dropdown.Menu className="dropdown-menu">
//                             <Dropdown.Item eventKey="1 Van">
//                                 1 Van
//                             </Dropdown.Item>
//                             <Dropdown.Item eventKey="2 Vans">
//                                 2 Vans
//                             </Dropdown.Item>
//                             <Dropdown.Item eventKey="3 Vans">
//                                 3 Vans
//                             </Dropdown.Item>
//                             <Dropdown.Item eventKey="4 Vans">
//                                 4 Vans
//                             </Dropdown.Item>
//                         </Dropdown.Menu>
//                     </Dropdown>{' '}
//                     </div>
//                 </div>
//             </div>
//         </div>
//         )
//     }
// }