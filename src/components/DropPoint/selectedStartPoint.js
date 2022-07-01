import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, compact, find, uniq } from 'lodash';
import moment from 'moment';
import agent from '../../agent';
import { Toast } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SUCCESS_MESSAGE, SELECTED_ORDER_POINT, CIRCLE_POSITION, SELECT_PICKUP, SUGGESTED_DRIVER } from '../../constants/actionTypes';

// import Shift from '../../assets/images/icons/icon-shift-sm.svg';
import Restaurant from '../../assets/images/StationMark.svg';
import Close from '../../assets/images/close.svg';
import Destination from '../../assets/images/red-point.svg';
import Loader from '../../assets/loader';

const mapStateToProps = state => ({
    ...state.dropPoint,
    ...state.common,
    ...state.geodata,
})

const mapDispatchToProps = dispatch => ({
    passSuccess: (payload) =>
        dispatch({ type: SUCCESS_MESSAGE, payload }),
    selectOrderPoint: (payload) =>
        dispatch({ type: SELECTED_ORDER_POINT, payload }),
    selectPickup: (payload) =>
        dispatch({ type: SELECT_PICKUP, payload }),
    passCircle: (payload) =>
        dispatch({ type: CIRCLE_POSITION, payload }),
    passSuggestedDriver: (payload) =>
        dispatch({ type: SUGGESTED_DRIVER, payload })
})

class SelectedStartPoint extends Component {
    constructor() {
        super();
        this.state = {
            selectedVan: {},
            selectedVehicleCode: '',
            selectedVanName: '',
            assignedVanName: '',
            assignStart: false,
            showToast: false,
            left: 0,
            top: 0,
            availableVan: [],
            suggestedVan: [],
            vanList: [],
            driverLoading: false,
        }
    }

    selectVan = (van) => {
        this.setState({
            selectedVan: van,
            selectedVehicleCode: van.vehicle_code,
            selectedVanName: van.name,
        })
    }

    calculateTask = (van) => {
        let vanNumber = find(this.state.vanList, ['name', van.name]);
        return vanNumber ? vanNumber.total_delivered_order : 'N/A'
    }

    assignVanToOrder = async () => {
        let body = {
            "order_number": this.props.selectedOrderPoint.order_number,
            "vehicle_number": this.state.selectedVan.vehicle_code
        }
        console.log("bodyyy", body)
        let res = await agent.BestRoute.assignVehicleToOrder(body);
        if (res.status === 500 || res.status === 400 || res.status === 422 || res.status === 404) {
            this.props.passSuccess("error")
        } else {
            this.props.passSuccess("success")
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.selectedOrderPoint !== prevProps.selectedOrderPoint) {
            if (!isEmpty(this.props.selectedOrderPoint)) {
                let temp;
                this.setState({
                    driverLoading: true,
                })
                const stationLatlng = find(this.props.totalStation, ["name", this.props.selectedOrderPoint.warehouse.split(',')[0]]).geojson;
                temp = stationLatlng;
                this.props.selectPickup(temp);
                this.props.passCircle({ 'lat': temp.coordinates[1], 'lng': temp.coordinates[0] })
                let vanList = await agent.BestRoute.vanListByDate(moment(this.props.startDate).format("YYYY-MM-DD"));
                let suggestedDriver = await agent.NearestCMS.nearest(temp.coordinates[1], temp.coordinates[0])
                let suggestedList = suggestedDriver.map(van => {
                    if (find(vanList.data, ['driver_id', parseInt(van.uid)])) {
                        let vanInfo = find(vanList.data, ['driver_id', parseInt(van.uid)]);
                        van['name'] = vanInfo.name;
                        van['vehicle_code'] = vanInfo.vehicle_code;
                        van['total_distance_travelled'] = vanInfo.total_distance_travelled;
                        van['total_delivered_order'] = vanInfo.total_delivered_order;
                        van['contact_no'] = vanInfo.contact_no;
                        return van
                    }
                    return null
                })
                if (this.props.selectedOrderPoint.assign_vehicle) {
                    let driver = find(vanList.data, ['vehicle_code', this.props.selectedOrderPoint.assign_vehicle.split("(").toString().split(")")[0].split(",")[1]]);
                    const suggestedDriver = this.props.geodata.data.features.filter(data => data.properties.userId == (driver ? driver.driver_id : ''))
                    const finalSuggested = suggestedDriver.map(driver => {
                        return {
                            ...driver,
                            coordinates: {
                                lat: driver.geometry.coordinates[1],
                                lng: driver.geometry.coordinates[0]
                            }
                        }
                    });
                    this.props.passSuggestedDriver(finalSuggested);
                }
                let availableList = vanList.data.map(van => {
                    if (!find(compact(suggestedList), ['uid', van.driver_id ? van.driver_id.toString() : ''])) {
                        let data = this.props.geodata.data.features.filter(data => data.properties.userId == van.driver_id)
                        if (data.length !== 0) {
                            return {
                                ...van,
                                coordinates: {
                                    lat: data[0].geometry.coordinates[1],
                                    lng: data[0].geometry.coordinates[0]
                                }
                            }
                        } else {
                            return van
                        }
                        ;
                    }
                    return null
                })
                let sortAvailable = compact(availableList).sort((a, b) => b.total_delivered_order - a.total_delivered_order);
                let duplicateFix = [];
                sortAvailable.forEach(driver => {
                    if (!duplicateFix.some(person => person.name === driver.name)) {
                        duplicateFix.push(driver)
                    }
                })
                this.setState({
                    selectedVehicleCode: this.props.selectedOrderPoint.assign_vehicle ? this.props.selectedOrderPoint.assign_vehicle.split("(").toString().split(")")[0].split(",")[1] : '',
                    assignedVanName: this.props.selectedOrderPoint.assign_vehicle ? this.props.selectedOrderPoint.assign_vehicle.split("(")[0] : '',
                    selectedVanName: this.props.selectedOrderPoint.assign_vehicle ? this.props.selectedOrderPoint.assign_vehicle.split("(")[0] : '',
                    suggestedVan: compact(suggestedList),
                    availableVan: duplicateFix,
                    vanList: uniq(vanList.data),
                    driverLoading: false,
                })
            }
        }
    }

    handleClose = () => {
        if (this.props.selectedOrders.length === 0) {
            this.props.selectPickup({})
        }
        this.props.selectOrderPoint({})
        this.props.passSuggestedDriver([])
    }

    onCopy = (e) => {
        this.setState({
            showToast: true,
            copiedUser: e
        })
    }

    orderStatus(del) {
        if (del.order_status === "Ready for Delivery") {
            if (del.assign_vehicle) {
                return '#B0ACD1'
            } else {
                return '#F5C315'
            }
        } else if (del.order_status === "Delivering") {
            return '#89BFE4'
        }
        else if (del.order_status === "Delivered") {
            return '#8ED2C9'
        }
        else if (del.order_status === "Cancelled") {
            return '#F0A79E'
        }
    }

    markerBullet = (marker) => {
        return <span className="spn-vans-dot" style={{ background: "url('/images/icons/offHourDriver.svg') no-repeat center" }}></span>
    }

    render() {
        const { selectedOrderPoint } = this.props;
        // console.log("seledted" ,selectedOrderPoint)
        const { selectedVan, selectedVehicleCode, showToast, suggestedVan, availableVan, selectedVanName, assignedVanName, driverLoading } = this.state;
        return (
            <div className={`started-point-sec ${!isEmpty(selectedOrderPoint) ? 'show' : ''}`}>
                <div style={{ position: 'absolute', top: "5px", right: "20px", cursor: "pointer" }} onClick={this.handleClose}><img src={Close} height="10px" width="10px" alt="close" /></div>
                <div className="inner-started-point-sec">
                    <div className="total-order-detail">
                        <h3 style={{ fontWeight: '600', color: this.orderStatus(selectedOrderPoint) }}>{selectedOrderPoint.order_status}</h3>
                        <div className="total-order-block">
                            <div className="order-detail-head">
                                <span className="spn-order-img">
                                    <img src={Destination} className="kfc" alt="restaurant" />
                                </span>
                                <h3>{selectedOrderPoint.customer_name}<br /><small>({selectedOrderPoint.customer_number || 'N/A'})</small></h3>
                                &nbsp;&nbsp;&nbsp;
                                <CopyToClipboard text={selectedOrderPoint.order_number} onCopy={() => this.onCopy(selectedOrderPoint.order_number)} >
                                    <span className="spn-copy" style={{ borderRadius: '24%', width: '41px' }}>
                                        <i className="fa fa-clone" aria-hidden="true">
                                        </i>
                                    </span>
                                </CopyToClipboard>

                                <Toast
                                    style={{
                                        position: 'absolute',
                                        top: 30,
                                        right: 10,
                                        zIndex: 999,
                                        hight: '50px',
                                        width: 'auto',
                                        fontSize: '11px',
                                    }}
                                    onClose={() => this.setState({ showToast: false })}
                                    show={showToast}
                                    delay={1000}
                                    autohide
                                >
                                    <Toast.Body>Copied</Toast.Body>
                                </Toast>

                            </div>
                            {/* <!-- ends order-detail-head --> */}
                            <div className="order-detail-head">
                                <span className="spn-order-img">
                                    <img src={Restaurant} className="kfc" alt="restaurant" />
                                </span>
                                <h3>{selectedOrderPoint.warehouse}<br /><small>({selectedOrderPoint.location || 'N/A'})</small></h3>
                            </div>
                            <div className="order-detail-body">
                                <table className="order-dtl-tbl">
                                    {/* <caption>
                             <img src={Restaurant} alt="vendor" height="27" width="27"></img>&nbsp;&nbsp;{selectedOrderPoint.warehouse}, <span>{selectedOrderPoint.location}</span></caption> */}
                                    <tbody>
                                        <tr>
                                            <td>Delivery Date</td>
                                            <td>: &nbsp; {moment(selectedOrderPoint.schedule_date).format('DD MMM, YYYY')} ({moment(selectedOrderPoint.schedule_time, 'HH:mm:ss').format('HH:mm')})</td>
                                        </tr>
                                        <tr>
                                            <td>Order No.</td>
                                            <td style={{ fontSize: '10px' }}>: &nbsp; {selectedOrderPoint.order_number || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td>Address</td>
                                            <td>: &nbsp; {selectedOrderPoint.customer_address || 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* <!-- ends order-detail-body --> */}
                        </div>
                        {/* <!-- ends total-order-block --> */}
                    </div>
                    {/* <!-- ends total-order-detail --> */}

                    <div className="all-vans-sec">
                        {selectedOrderPoint.order_status === "Ready for Delivery" ?
                            <div className="inner-vans-sec">
                                {suggestedVan.length !== 0 ?
                                    <div className="vans-block">
                                        <h4>Suggested Van</h4>
                                        {driverLoading ? <Loader /> :
                                            <div className="vans-dtl-block">
                                                {find(suggestedVan, ["name", assignedVanName]) ?
                                                    <div className="vans-block-item">
                                                        {this.markerBullet(find(suggestedVan, ["name", assignedVanName]))}
                                                        <div className="vans-num-dtl">
                                                            <h5>{find(suggestedVan, ["name", assignedVanName]).name} {this.props.permissions.includes('KM') ? `| ${Number(find(suggestedVan, ["name", assignedVanName]).km).toFixed(1)} KM` : ''} {this.props.permissions.includes('TS') ? <small>({moment(parseInt(find(suggestedVan, ["name", assignedVanName]).ts)).fromNow(true)})</small> : ''}</h5>
                                                            <p>{this.props.permissions.includes('Task') ? `${(find(suggestedVan, ["name", assignedVanName]).total_delivered_order)} Task |` : ''} {this.props.permissions.includes('KM') ? `${find(suggestedVan, ["name", assignedVanName]).total_distance_travelled ? (Number(find(suggestedVan, ["name", assignedVanName]).total_distance_travelled) / 1000).toFixed(1) : '0'} KM completed ` : ''} </p>
                                                            <p>({find(suggestedVan, ["name", assignedVanName]).contact_no ? find(suggestedVan, ["name", assignedVanName]).contact_no : 'N/A'})</p>
                                                        </div>
                                                        <button type="button" className={`btn btn-point ${selectedVehicleCode.trim() === find(suggestedVan, ["name", assignedVanName]).vehicle_code.trim() ? 'active' : ''}`} onClick={this.selectVan.bind(this, find(suggestedVan, ["name", assignedVanName]))}></button>
                                                    </div>
                                                    : ''
                                                }
                                                {suggestedVan.map((suggest, Key) => {
                                                    if (suggest.name !== assignedVanName) {
                                                        return (<div key={Key} className="vans-block-item">
                                                            {this.markerBullet(suggest)}
                                                            <div className="vans-num-dtl">
                                                                <h5>{suggest.name} {this.props.permissions.includes('KM') ? `| ${Number(suggest.km).toFixed(1)} KM ` : ''}{this.props.permissions.includes('TS') ? <small>({moment(parseInt(suggest.ts)).fromNow(true)})</small> : ''}</h5>
                                                                <p>{this.props.permissions.includes('Task') ? `${(suggest.total_delivered_order)} Task |` : ''} {this.props.permissions.includes('KM') ? `${suggest.total_distance_travelled ? (Number(suggest.total_distance_travelled) / 1000).toFixed(1) : '0'} KM completed` : ''}  </p>
                                                                <p>({suggest.contact_no ? suggest.contact_no : 'N/A'})</p>
                                                            </div>
                                                            <button type="button" className={`btn btn-point ${selectedVehicleCode.trim() === suggest.vehicle_code.trim() ? 'active' : ''}`} onClick={this.selectVan.bind(this, suggest)}></button>
                                                        </div>)
                                                    }
                                                    return null;
                                                })
                                                }
                                            </div>
                                        }
                                    </div> : ''}

                                <div className="vans-block">
                                    <h4>Available Van</h4>
                                    {driverLoading ? <Loader /> :
                                        <div className="vans-dtl-block">
                                            {find(availableVan, ["name", assignedVanName]) ?
                                                <div className="vans-block-item">
                                                    {this.markerBullet(find(availableVan, ["name", assignedVanName]))}
                                                    <div className="vans-num-dtl">
                                                        <h5>{find(availableVan, ["name", assignedVanName]).name || 'N/A'}</h5>
                                                        {/* <span>32Km</span> */}
                                                        <p>{this.props.permissions.includes('Task') ? `${find(availableVan, ["name", assignedVanName]).total_delivered_order} Task |` : ''} {this.props.permissions.includes('KM') ? `${find(availableVan, ["name", assignedVanName]).total_distance_travelled ? (Number(find(availableVan, ["name", assignedVanName]).total_distance_travelled) / 1000).toFixed(1) : 0} KM completed` : ''}</p>
                                                        <p>({find(availableVan, ["name", assignedVanName]).contact_no ? find(availableVan, ["name", assignedVanName]).contact_no : 'N/A'})</p>
                                                    </div>
                                                    <button type="button" className={`btn btn-point ${selectedVehicleCode.trim() === find(availableVan, ["name", assignedVanName]).vehicle_code.trim() ? 'active' : ''}`} onClick={this.selectVan.bind(this, find(availableVan, ["name", assignedVanName]))}></button>
                                                </div>
                                                : ''
                                            }
                                            {availableVan.length !== 0 ? availableVan.map((van, Key) => {
                                                if (van.name !== assignedVanName) {
                                                    return (
                                                        <div className="vans-block-item" key={Key}>
                                                            {this.markerBullet(van)}
                                                            <div className="vans-num-dtl">
                                                                <h5>{van.name || 'N/A'}</h5>
                                                                {/* <span>32Km</span> */}
                                                                <p>{this.props.permissions.includes('Task') ? `${van.total_delivered_order} Task |` : ''} {this.props.permissions.includes('KM') ? `${van.total_distance_travelled ? (Number(van.total_distance_travelled) / 1000).toFixed(1) : '0'} KM completed` : ''}</p>
                                                                <p>({van.contact_no ? van.contact_no : 'N/A'})</p>
                                                            </div>
                                                            <button type="button" className={`btn btn-point ${selectedVehicleCode.trim() === van.vehicle_code.trim() ? 'active' : ''}`} onClick={this.selectVan.bind(this, van)}></button>
                                                        </div>
                                                    )
                                                }
                                                return '';
                                            }
                                            ) : ''}
                                        </div>}
                                </div>
                                {/* <!-- ends vans-block --> */}
                            </div>
                            :
                            <div className="inner-vans-sec">
                                <div className="vans-block">
                                    <h4>Assigned Van</h4>
                                    {driverLoading ? <Loader /> :
                                        <div className="vans-dtl-block">
                                            <div className="vans-block-item">
                                                <span className="spn-vans-dot"></span>
                                                <div className="vans-num-dtl">
                                                    <h5>{selectedVanName}</h5>
                                                    <p>{this.props.permissions.includes('Task') ? `${this.calculateTask({ name: selectedVanName })} Task` : ''} </p>
                                                </div>
                                                {/* <button type="button" className={`btn btn-point ${selectedVehicleCode.trim()===suggest.vehicle_code.trim()?'active':''}`} onClick={this.selectVan.bind(this,suggest)}></button> */}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                        {/* <!-- ends inner-vans-sec --> */}
                        {/* <a href="#" className="a-all">See All Van List</a> */}
                    </div>
                    <div className="btn-fixed">
                        <div className="btm-save-btn">
                            {selectedOrderPoint.order_status === "Ready for Delivery" ?
                                <button type="button" className="btn btn-wide-txt btn-av-van w-100 active" disabled={isEmpty(selectedVan)} onClick={this.assignVanToOrder}>Save Changes</button>
                                : ''}
                            <button type="button" className="btn btn-wide-txt w-100 active" style={{ background: "#ff1a1a" }} onClick={this.handleClose}>Close</button>
                        </div>
                    </div>
                </div>
                {/* <!-- ends inner-started-point-sec --> */}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedStartPoint);