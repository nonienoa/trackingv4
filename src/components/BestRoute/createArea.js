import React from 'react';

//import Component
import agent from '../../agent';
import {
    CREATE_POLYGON,
    DELETE_POLYGON,
    PRELOAD_POLYGON,
    CUSTOM_POLYGON,
    SUGGESTED_POINT,
    SELECTED_FIXED_POLYGON,
    SUCCESS_MESSAGE,
    SELECTED_POLYGON,
    SELECTED_STATION
} from '../../constants/actionTypes';

//import Package
import { connect } from 'react-redux';

//import Image
import Preload from '../../assets/images/icons/icon-preload.svg';
import PreloadWhite from '../../assets/images/icons/icon-preload-white.svg';
import Auto from '../../assets/images/icons/icon-auto.svg';
import AutoWhite from '../../assets/images/icons/icon-auto-white.svg';
import Plus from '../../assets/images/icons/icon-plus.svg';
import PlusWhite from '../../assets/images/icons/icon-plus-white.svg';
import Delete from '../../assets/images/icons/icon-delete.svg';
import DeleteWhite from '../../assets/images/icons/icon-delete-white.svg';
import Square from '../../assets/images/icons/icon-squares.svg';
import SquareWhite from '../../assets/images/icons/icon-squares-white.svg';
import Pen from '../../assets/images/icons/icon-pen.svg';
import PenWhite from '../../assets/images/icons/icon-pen-white.svg';
import Pointer from '../../assets/images/icons/icon-pointer.svg';
import PointerWhite from '../../assets/images/icons/icon-pointer-white.svg';
import Edit from '../../assets/images/icons/icon-edit.svg';
import Order from '../../assets/images/icons/icon-order.svg';

const mapStateToProps = state => ({
    ...state.bestRoute,
})

const mapDispatchToProps = dispatch => ({
    toggleCreatePolygon: () => 
        dispatch({ type: CREATE_POLYGON }),
    deletePolygon: () => 
        dispatch({ type: DELETE_POLYGON, payload: 'delete' }),
    preloadPolygon: (payload) =>
        dispatch({ type: PRELOAD_POLYGON, payload }),
    customPolygon: (payload) =>
        dispatch({ type: CUSTOM_POLYGON, payload }),
    suggestedPoint: (payload) =>
        dispatch({ type: SUGGESTED_POINT, payload }),
    resetSelectedFixedPolygon: (payload) => 
        dispatch({ type: SELECTED_FIXED_POLYGON, payload: [] }),
    resetSelectedPolygon: (payload) => 
        dispatch({ type: SELECTED_FIXED_POLYGON, payload: {} }),
    selectedPolygon: (payload) =>
        dispatch({ type:SELECTED_POLYGON, payload }),
    selectStation: (payload) => 
        dispatch({ type:SELECTED_STATION, payload }),
    passSuccess:(payload) => 
        dispatch({ type: SUCCESS_MESSAGE, payload })
})

class CreateArea extends React.Component {

    constructor() {
        super();
        this.state = {
            showCreateArea: false,
            showEditArea: false,
            createPolygon: false,
            togglePreload:false,
            newAreaName: '',
            editName: '',
            selectedArea:{},
            customArea: [],
            showAreaInfo: false
        }
    }

    async componentDidMount() {
        let customArea = await agent.BestRoute.getArea('custom');
        this.setState({
            customArea: customArea.data
        })   
    }

    componentDidUpdate(prevProps) {
        if(this.props.customAreaData !== prevProps.customAreaData) {
            this.setState({
                customArea: this.props.customAreaData
            })
        }
    }

    toggleCreateArea = async () => {
        if(!this.state.showCreateArea){
            this.props.customPolygon(this.state.customArea)
        } else {
            this.props.customPolygon([])
        }
        this.setState({
            showCreateArea: !this.state.showCreateArea,
            showEditArea: false,
        })
        this.props.preloadPolygon([])
        this.props.deletePolygon();
    }

    toggleCreatePolygon = () => {
        this.setState({
            createPolygon: !this.state.createPolygon
        })
        this.props.toggleCreatePolygon()
    }

    handleNewAreaName = (e) => {
        this.setState({
            newAreaName: e.target.value
        })
    }

    handleEditAreaName = (e) => {
        this.setState({
            editName: e.target.value
        })
    }

    preloadData = async () => {
        this.setState({
            togglePreload: !this.state.togglePreload
        })
        this.props.selectStation({station: null, vanNumber: null})
        if(!this.state.togglePreload){
            let preloadData = await agent.BestRoute.getArea('fixed');
            this.props.preloadPolygon(preloadData.data)
            this.props.customPolygon([])
        } else {
            this.props.preloadPolygon([])
            this.props.customPolygon([])
        }
    }

    saveArea = async () => {
        let formData = new FormData();    
        let lgrp = ""   
        for (var i = 0; i < this.props.newPolygon.length; i++) {
            if (lgrp === "")
                lgrp = this.props.newPolygon[i][1] + " " + this.props.newPolygon[i][0];
            else
                lgrp = lgrp + "," + this.props.newPolygon[i][1] + " " + this.props.newPolygon[i][0];
        }
        formData.append('json', `((${lgrp}))`) 
        formData.append('name',this.state.newAreaName);
        await agent.BestRoute.createArea(formData);
        let customArea = await agent.BestRoute.getArea('custom');
        this.props.toggleCreatePolygon()
        this.props.deletePolygon()
        this.setState({
            customArea: customArea.data,
            newAreaName: '',
            createPolygon: !this.state.createPolygon,
            showCreateArea: !this.state.showCreateArea
        })
        this.props.passSuccess("success")
    }

    editArea = async () => {
        let formData = new URLSearchParams();
        let polygon = this.state.selectedArea.geojson.coordinates[0]    
        let lgrp = ""  
        for (var i = 0; i < polygon.length; i++) {
            if (lgrp === "")
                lgrp = polygon[i][0] + " " + polygon[i][1];
            else
                lgrp = lgrp + "," + polygon[i][0] + " " + polygon[i][1];
        }
        formData.append('json', `((${lgrp}))`) 
        formData.append('name',this.state.editName);
        await agent.BestRoute.editArea(this.state.selectedArea.id,formData);
        let customArea = await agent.BestRoute.getArea('custom');
        this.props.preloadPolygon([])
        this.props.resetSelectedFixedPolygon()
        this.props.customPolygon([])
        this.setState({
            customArea: customArea.data,
            showEditArea: !this.state.showEditArea
        }) 
        this.props.passSuccess("success")
    }

    handleEdit = async (area,e) => {
        this.setState({
            showEditArea: !this.state.showEditArea,
            selectedArea: area,
            editName: area.name,
            showCreateArea: false
        })
        if(!this.state.showEditArea) {
            let suggestedPoint = await agent.BestRoute.getStation(area.id,'custom')
            this.props.suggestedPoint(suggestedPoint.data);
            this.props.customPolygon([area])
        } else {
            this.props.customPolygon([])
        }
    }

    loadPolygon = (area) => {
        this.props.customPolygon([])
        this.setState({
            showAreaInfo: !this.state.showAreaInfo
        })
        window.setTimeout(async() => {
            let suggestedPoint = await agent.BestRoute.getStation(area.id,'custom')
            this.props.suggestedPoint(suggestedPoint.data);
            this.props.selectStation({station:area.station, vanNumber: area.total_route})
            this.props.selectedPolygon({ 'id':area.id, 'name': area.name })
            this.props.customPolygon([area])
        }, 200)
    }

    deleteArea = async () => {
        await agent.BestRoute.deleteArea(this.state.selectedArea.id);
        let customArea = await agent.BestRoute.getArea('custom');
        this.setState({
            customArea: customArea.data,
            showEditArea: false
        })
        this.props.preloadPolygon([])
        this.props.customPolygon([])
        this.props.resetSelectedPolygon()
        this.props.passSuccess("success")
    }

    render() {
        const { showArea, preloadPolygons, customPolygons } = this.props;
        const { showCreateArea, showEditArea, createPolygon, newAreaName, editName, togglePreload } = this.state;
        return(
            <div className={`left-wide-sec ${showArea?'show':''}`}>
                <div className="wide-upper">
                    <div className="wide-btn-groups">
                        <button type="button" onClick={this.preloadData} className={`btn btn-wide-txt icon-change ${togglePreload && preloadPolygons.length!==0?'active':''}`}>
                            <img src={Preload} className="icon-gray" alt="preload" />
                            <img src={PreloadWhite} className="icon-white" alt="preload" />
                            Preload
                        </button>
                        <button type="button" className="btn btn-wide-txt icon-change">
                            <img src={Auto} className="icon-gray" alt="auto" />
                            <img src={AutoWhite} className="icon-white" alt="auto" />
                            Auto
                        </button>
                    </div>
                    <div className="wide-btn-groups">
                        <button type="button" onClick={this.toggleCreateArea} className={`btn btn-wide-txt w-100 icon-change ${showCreateArea?'active':''}`}>
                            <img src={Plus} className="icon-gray" alt="plus" />
                            <img src={PlusWhite} className="icon-white" alt="plus" />
                            Custom Area
                        </button>
                    </div>
                    <div className={`wide-btn-groups wide-edt-btn ${showCreateArea?'show':''}`}>
                        <button type="button" onClick={this.props.deletePolygon} className="btn btn-edt-opt icon-change">
                            <img src={Delete} className="icon-gray" alt="delete" />
                            <img src={DeleteWhite} className="icon-white" alt="delete" />
                        </button>
                        <button type="button" className="btn btn-edt-opt icon-change">
                            <img src={Square} className="icon-gray" alt="squares" />
                            <img src={SquareWhite} className="icon-white" alt="squares" />
                        </button>
                        <button type="button" onClick={this.toggleCreatePolygon} className={`btn btn-edt-opt icon-change ${createPolygon?'active':''}`}>
                            <img src={Pen} className="icon-gray" alt="pen" />
                            <img src={PenWhite} className="icon-white" alt="pen" />
                        </button>
                        <button type="button" className="btn btn-edt-opt icon-change">
                            <img src={Pointer} className="icon-gray" alt="pointer" />
                            <img src={PointerWhite} className="icon-white" alt="pointer" />
                        </button>
                    </div>
                    <div className={`wide-btn-groups wide-edt-btn ${showEditArea?'show':''}`}>
                        <button type="button" onClick={this.deleteArea} className="btn btn-edt-opt icon-change">
                            <img src={Delete} className="icon-gray" alt="delete" />
                            <img src={DeleteWhite} className="icon-white" alt="delete" />
                        </button>
                        <button type="button" className="btn btn-edt-opt icon-change">
                            <img src={Square} className="icon-gray" alt="squares" />
                            <img src={SquareWhite} className="icon-white" alt="squares" />
                        </button>
                        <button type="button" className={`btn btn-edt-opt icon-change`}>
                            <img src={Pen} className="icon-gray" alt="pen" />
                            <img src={PenWhite} className="icon-white" alt="pen" />
                        </button>
                        <button type="button" className="btn btn-edt-opt icon-change">
                            <img src={Pointer} className="icon-gray" alt="pointer" />
                            <img src={PointerWhite} className="icon-white" alt="pointer" />
                        </button>
                    </div>
                </div>
            <div className={`create-block ${showCreateArea?'show':''}`}>
                <h3>Create Area</h3>
                <form>
                    <input type="text" onChange={this.handleNewAreaName} value={newAreaName} className="form-control" placeholder="Name Area" />
                    <div className="btn-groups d-flex justify-content-between">
                        <button type="button" onClick={this.toggleCreateArea} className="btn btn-custom btn-cancel mr-3">Cancel</button>
                        <button type="button" onClick={this.saveArea} className="btn btn-custom btn-save">Save</button>
                    </div>
                </form>
            </div>
            <div className={`create-block ${showEditArea?'show':''}`}>
                <h3>Create Area</h3>
                <form>
                    <input type="text" onChange={this.handleEditAreaName} value={editName} className="form-control" placeholder="Name Area" />
                    <div className="btn-groups d-flex justify-content-between">
                        <button type="button" onClick={this.handleEdit} className="btn btn-custom btn-cancel mr-3">Cancel</button>
                        <button type="button" onClick={this.editArea} className="btn btn-custom btn-save">Save</button>
                    </div>
                </form>
            </div>
            {/* !-- ends create-block --> */}
            <div className="wide-lower" style = {{ display: showCreateArea?'none':'' }}>
                <h4>{ this.props.preloadPolygons.length===0?'Previously Created Area':'Fixed Area'}</h4>
                <div className="created-area">
                    { this.props.preloadPolygons.length===0?this.state.customArea.map((area,Key) => 
                        <div className="crtd-area-item" key={Key}>
                            <div className="crtd-title">
                                <h5 onClick={this.loadPolygon.bind(this,area)} style={{ cursor:"pointer" }}>{area.name}</h5>
                                <p style={{display: (customPolygons[0]=== area)?"none":''}}><span className="spn-crtd-rt">{area.total_route || 0} Route</span></p>
                                <div className="inner-crtd" style={{display: (customPolygons[0]=== area)?"":'none'}}>
                                    <p><span className="inr-crtd-left"><span className="inr-crtd-dots"></span></span>
                                        <span className="inr-crtd-txt">{area.total_route || 0} Route</span>
                                    </p>
                                    <p><span className="inr-crtd-left"><img src={Order} alt="order" /></span>
                                        <span className="inr-crtd-txt">Total Order {area.total_order || 0}</span>
                                    </p>
                                    <p><span className="inr-crtd-left"><span className="inr-crtd-dots"></span></span>
                                        <span className="inr-crtd-txt">Station : {area.total_station || 0}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="crtd-edit">
                                <button onClick={this.handleEdit.bind(this,area)} className="spn-edit"><img src={Edit} alt="edit" /></button>
                            </div>
                        </div>
                    ):this.props.preloadPolygons.map((area, Key) => 
                        <div className="crtd-area-item" key={Key}>
                            <div className="crtd-title">
                                <h5>{area.name}</h5>
                                {/* <p><span className="spn-crtd-rt">{area.total_route || 0} Route</span></p> */}
                                <div className="inner-crtd">
                                    <p><span className="inr-crtd-left"><span className="inr-crtd-dots"></span></span>
                                        <span className="inr-crtd-txt">{area.total_route || 0} Route</span>
                                    </p>
                                    <p><span className="inr-crtd-left"><img src={Order} alt="order" /></span>
                                        <span className="inr-crtd-txt">Total Order {area.total_order}</span>
                                    </p>
                                    <p><span className="inr-crtd-left"><span className="inr-crtd-dots"></span></span>
                                        <span className="inr-crtd-txt">Station : {area.station || 'n/a'}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) }
                    {/* <!-- ends crtd-area-item --> */}
                </div>
                {/* <!-- ends created-area --> */}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CreateArea);