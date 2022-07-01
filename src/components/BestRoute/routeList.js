import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { find, times, compact, reject, findIndex } from 'lodash';
import { SELECTED_START_POINT, ROUTE_NUMBER, MAP_CHANGE } from '../../constants/actionTypes';
import { connect } from 'react-redux';
import agent from '../../agent';
import Delete from '../../assets/images/icons/icon-path-del.svg';
import Tick from '../../assets/images/icons/icon-tick.svg';
import Edit from '../../assets/images/icons/icon-edit.svg';
import Save from '../../assets/images/save-white.svg';
import Van from '../../assets/images/van.svg';
import Close from '../../assets/images/close-white.svg';
import Loader from '../../assets/loader';

const mapDispatchToProps = dispatch => ({
	passRouteNumber: payload =>
		dispatch({ type: ROUTE_NUMBER, payload }),
	selectedStartPoint: (payload) =>
		dispatch({ type: SELECTED_START_POINT, payload }),
	zoomToMarker: (payload) =>
		dispatch({ type: MAP_CHANGE, payload }),
})

const mapStateToProps = state => ({
	routeNumber: state.bestRoute.routeNumber,
	totalRouteList: state.bestRoute.totalRouteList,
	filterDay: state.bestRoute.filterDay,
	filterShift: state.bestRoute.filterShift,
	filterStation: state.bestRoute.filterStation
})

const color = [ '#5dd916c4','#137ac9c4','#e9ae36c4','#ff704bc4' ]


class RouteList extends React.Component {
	constructor() {
		super();
		this.state = {
			routeList: [],
			unAssignedList: [],
			assignRouteList: [],
			assignRoute: false,
			showUnassign: false
		}
	}

	async componentDidUpdate(prevProps) {
		if(this.props.routeList!==prevProps.routeList) {
			this.setState({
				routeList: this.props.routeList,
				unAssignedList: this.props.unAssignedList
			})
		}
		if(this.props.totalRouteList !== prevProps.totalRouteList) {
			this.setState({
				routeList: this.props.totalRouteList.data,
				unAssignedList: this.props.totalRouteList.unassigned
			})	
		}
		if((this.props.filterDay !== prevProps.filterDay) || (this.props.filterShift !== prevProps.filterShift) || (this.props.filterStation !== prevProps.filterStation)){
			const { filterStation, filterDay, filterShift } = this.props;
			let routeList = await agent.BestRoute.routeList(filterDay, filterShift,  filterStation);
			this.setState({
                routeList: routeList.data,
                unAssignedList: routeList.unassigned
			})
		}
	}

	callRouteList = async () => {
		const { filterStation, filterDay, filterShift } = this.props;
        let routeList = await agent.BestRoute.routeList(filterDay, filterShift,  filterStation);
            this.setState({
                routeList: routeList.data,
                unAssignedList: routeList.unassigned
			})		
	}

	toggleAssignRoute = (show) => {
		this.setState({
			assignRoute: show
		})
	}

	handleRouteAssign = (order, route) => {
		let data = {
			"order_no": order,
			"route": route
		}
		let newArray = this.state.assignRouteList;
		for(let i=0; i<newArray.length; i++) {
			if(parseInt(newArray[i].order_no) === parseInt(order)){
				newArray[i]= null
			}
		}
		newArray.push(data)
		this.setState({
			assignRouteList: compact(newArray)
		})
	}

	saveRoute = async () => {
		if(this.state.assignRouteList.length!==0) {
			await agent.BestRoute.assignOrderToRoute(this.state.assignRouteList)
			this.setState({
				assignRouteList:[]
			})
			this.callRouteList()
			this.toggleAssignRoute(false)
			this.props.passSuccess("success")
		} else {
			this.toggleAssignRoute(false)
		}
	}

	findRoute(order){
		let order1 = find(this.state.assignRouteList,['order_no',order])
		if(order1) {
			let route = find(this.state.routeList,['route_id', parseInt(order1.route)])
			return route.name
		} else {
			return ''
		}
	}

	setZoom = (unassign) => {
		let zoom = { 
						"zoom": 18, 
						"center":{
							"lng":unassign.geojson.coordinates[0],
							"lat":unassign.geojson.coordinates[1]
						}  
					}
		this.props.zoomToMarker(zoom)
	}

	toggleUnassign = () => {
		this.setState({
			showUnassign: !this.state.showUnassign
		})
	}

	closeUnassign = () => {
		this.setState({
			showUnassign: false,
			assignRouteList: [],
			assignRoute: false
		})
	}

	render() {
		const { activeTab, vanList } = this.props;
		const { routeList, unAssignedList, assignRoute, showUnassign } = this.state;
		return (
			<>
				<div className="route-list-sec" style={{ display: `${activeTab === 'routeList' ? '' : 'none'}` }}>
					{unAssignedList.length!==0?<div className="unassigned-sec">
						<div className="unassign-head">
							<span className="spn-unagn-dots"></span>
							<div className="unagn-title" style={{ cursor: "pointer" }} onClick={this.toggleUnassign}>
								<h3>Unassigned Task</h3>
								<p>{unAssignedList.length} Task</p>
							</div>
							<div className="unagn-btn-grp">
								{ assignRoute?
								<>
									<button type="button" className="btn btn-unasgn btn-rut" onClick={this.saveRoute} style={{ marginRight: "5px" }}>
										<img src={Save} alt="edit" height="15px" width="15px" />
									</button>
									<button type="button" className="btn btn-unasgn btn-rut" onClick={this.closeUnassign} style={{ marginRight: "5px" }} >
										<img src={Close} alt="edit" height="15px" width="15px" />
									</button>
								
								</>
								:
								<button type="button" className="btn btn-unasgn" onClick={this.toggleAssignRoute.bind(this,true)}>
									<img src={Edit} alt="edit" />
								</button>
								}
							</div>
						</div>

						<div className="unassign-body" style={{ display: showUnassign || assignRoute ?'':'none' }}>
							{ unAssignedList.map((unassign, Key) => 
								<div className="unagn-body-item" key={Key}>
									<span className="unagn-bdy-dots" ></span>
									<div className="unagn-bdy-title" style={{cursor: "pointer"}} onClick={this.setZoom.bind(this,unassign)}>
										<h4>{unassign.location?unassign.location:'N/A'}</h4>
										{/* <p>Shyam Rana sheetty</p> */}
									</div>
									<div className="unagn-body-drop" style={{display: `${assignRoute?'':'none'}`}}>
										{ this.state.routeList.length!==0?
											<div className="dropdown">
												<Dropdown onSelect={this.handleRouteAssign.bind(this,unassign.order_number)}>
													<Dropdown.Toggle id="dropdownMenuButton" className="btn dropdown-toggle">
														{this.findRoute(unassign.order_number)}<i className="fa fa-chevron-down" aria-hidden="true"></i>
													</Dropdown.Toggle>
													<Dropdown.Menu className="dropdown-menu">
														{ this.state.routeList.map((route, Key) => {
															if(!route.is_confirmed){
																return(<Dropdown.Item eventKey={route.route_id} key={Key}>
																	{route.name}
																</Dropdown.Item>)
															}
															return null
														}
															
														) }
													</Dropdown.Menu>
												</Dropdown>{' '}
											</div>
										:'' }
									</div>
								</div>
							) }
						</div>
					</div>:''}

					<div className="route-detail-sec">
						{ routeList.length!==0?routeList.map((route, Key)=> 
							<RouteItem 
								route={route} 
								number={Key} key={Key} 
								vanList={vanList} 
								callRouteList={this.callRouteList} 
								passSuccess={this.props.passSuccess}
								passRouteNumber={this.props.passRouteNumber} 
								routeNumber={this.props.routeNumber}
								/>
						):'' }
					</div>
				</div>
			</>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteList)

export class RouteItem extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			enableEdit: false,
			selectedVan: props.route.van_id,
			changedPosition: [],
			selectedOrder: [],
			showOnlyOrder: false,
			showRouteNumber: false,
			showEditVan: false,
			startSave: false,
			startVanChange: false
		}
	}

	componentDidUpdate(prevProps){
		if(this.props.route !== prevProps.route){
			let newRoute = this.props.routeNumber
			let index = findIndex(newRoute,['route_id', this.props.route.route_id]);
			if(index > -1){
				this.props.route['color'] = color[this.props.number]
				newRoute[index] = this.props.route;
				this.props.passRouteNumber([])
				window.setTimeout(()=> {
					this.props.passRouteNumber(newRoute)
				},200)
			}
		}
	}

	toggleEdit = (show) => {
		this.setState({
			enableEdit: show,
			showOnlyOrder: !show
		})
	}
	
	handleVanChange = async (name) => {
		this.setState({
			selectedVan: name,
			startVanChange: true,
		})
		let van = await agent.BestRoute.assignVanToRoute(this.props.route.route_id,name)
		this.props.callRouteList()
		if(van.status === 404 || van.status === 500 || van.status === 422) {
			this.props.passSuccess("error")
		} else {
			this.props.passSuccess("success")
		}
		this.setState({
			showEditVan: false,
			startVanChange: false
		})
	}

	getVanName(id){
		if(id) {
			let vanName = find(this.props.vanList,[ "vehicle_code", id.toString() ]) 
			return vanName.name
		}
		return 'No van'
	}

	handleSave = async (route, color) => {
		this.setState({
			startSave: true
		})
		if(this.state.changedPosition.length !==0) {
			let res = await agent.BestRoute.moveOrderPosition(this.state.changedPosition.join(','), this.props.route.route_id)
			if(!res.data){
				this.props.passSuccess("error")
			} else {
				this.props.passSuccess("success")
			}
			this.setState({
				changedPosition:[]
			})
			this.props.callRouteList()
			this.toggleEdit(false)
		} else {
			this.toggleEdit(false)
		}
		this.setState({
			startSave: false
		})
	}

	handleClose = () => {
		this.setState({
			changedPosition: [],
			enableEdit: false,
			selectedOrder: [],
			showOnlyOrder: false
		})
	}

	handlePositionChange = (oldPosition, newPosition) => {
		if(oldPosition){
			let position = oldPosition+'-'+newPosition;
			let newArray = this.state.changedPosition;
			for(let i=0; i<newArray.length; i++) {
				if(parseInt(newArray[i].split('-')[0])===oldPosition){
					newArray[i]= null
				}
			}
			if(oldPosition !== parseInt(newPosition)){
				newArray.push(position)
			}
			this.setState({
				changedPosition: compact(newArray)
			})
		}
	}

	handleCheck = (order_no) => {
		let newArray = this.state.selectedOrder;
		if(newArray.includes(order_no)){
			for(let i=0; i<newArray.length;i++){
				if(parseInt(newArray[i])===parseInt(order_no)) {
					newArray[i] = null
				}
			}
		} else {
			newArray.push(order_no)
		}
		this.setState({
			selectedOrder: compact(newArray)
		})
	}

	handleOrderDelete = async (route) => {
		let newArray = [];
		for(let i=0; i<this.state.selectedOrder.length;i++) {
			let data = { "order_no":this.state.selectedOrder[i], "route": route }
			newArray.push(data)
		}
		await agent.BestRoute.removeOrderFromRoute(newArray)
		this.props.callRouteList();
		this.setState({
			selectedOrder: []
		})
	}

	toggleShowOrder = () => {
		if(!this.state.enableEdit) {
			this.setState({
				showOnlyOrder: !this.state.showOnlyOrder
			})
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
	
	findPosition = (oldPosition) => {
		let value = this.state.changedPosition.map(position => {
			if(parseInt(position.split("-")[0]) === oldPosition){
				return position
			}
			return null
		})
		return value || ''
	}

	toggleVanEdit = () => {
		this.setState({
			showEditVan: true
		})
	}

	render() {
		const { route, number } = this.props;
		const { enableEdit, selectedVan, selectedOrder, showOnlyOrder, startSave, showEditVan, startVanChange } = this.state;
		return(
			<div className="rut-dtl-item">
				<div className="rut-dtl-head">
					<span className="spn-rut-dtl-dot" style={{backgroundColor:color[number], cursor:'pointer'}} onClick={this.loadRouteNumber.bind(this,route,color[number])}></span>
					<div className="rut-head-title" style={{cursor: "pointer", fontWeight: find(this.props.routeNumber,route)?700:""}} onClick={this.toggleShowOrder}>
						<h4 style={{fontWeight: find(this.props.routeNumber,route)?700:""}}>{route.name} ({route.total_delivery} Task)</h4>
						<p>{route.area_name}({route.warehouse})</p>
					</div>
					<div className="right-head-btns">
						{ this.props.vanList.length!==0?
						showEditVan?
							<div className="rut-head-drop">
								<div className="dropdown">
								<Dropdown onSelect={this.handleVanChange}>
									<Dropdown.Toggle id="dropdownMenuButton" className="btn dropdown-toggle">
										{!startVanChange?this.getVanName(selectedVan):<Loader/>}<i className="fa fa-chevron-down" aria-hidden="true"></i>
									</Dropdown.Toggle>
									<Dropdown.Menu className="dropdown-menu">
										{ this.props.vanList.length!==0? this.props.vanList.map((van, Key)=>
											<Dropdown.Item eventKey={van.vehicle_code} key={Key}>
												{ van.name }
											</Dropdown.Item>
										) :'' }
									</Dropdown.Menu>
								</Dropdown>{' '}		
								</div>
							</div>:
							<button type="button" className="btn btn-rut-edit"  style = {{ backgroundColor: '#781119', marginRight: "5px" }} onClick={this.toggleVanEdit}>
								<img src={Van} alt="edit" />
							</button>
						:'' }
						{!enableEdit?
						!route.is_confirmed?
							<button type="button" className="btn btn-rut-edit" onClick={this.toggleEdit.bind(this,true)}>
								<img src={Edit} alt="edit" />
							</button>
							:
							<button type="button" className="btn btn-rut-save" style={{ backgroundColor: '#14A20F' }} disabled>
								<img src={Tick} alt="tick icon"/> 
							</button>
						:
						<>							
							<button type="button" className="btn btn-rut-save" onClick={this.handleSave.bind(this,route,color[number])}>
								{ startSave?
								<Loader/>
								:
								<img src={Save} alt="save icon" height="15px" width="15px" />
								 }
							</button>
							{route.is_confirmed?"":<button type="button" className="btn btn-rut-del" onClick={this.handleOrderDelete.bind(this,route.route_id)}><img src={Delete} alt="delete" /></button>}
							<button type="button" className="btn btn-rut-save" style = {{ backgroundColor: '#781119' }} onClick={this.handleClose}>
								<img src={Close} alt="save icon" />
							</button>
						</>
						}
					</div>
				</div>
				{/* <!-- ends rut-dtl-head --> */}
				{enableEdit || showOnlyOrder ?
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
								{ showOnlyOrder?'':route.is_confirmed?'':<div className="rut-item-btns">
									<div className="dropdown dropvan">
									<Dropdown onSelect={this.handlePositionChange.bind(this,delivery.position)}>
										<Dropdown.Toggle id="dropdownMenuButton" className="btn dropdown-toggle">
											{this.findPosition(delivery.position)}<i className="fa fa-chevron-down" aria-hidden="true"></i>
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu">
										{times(route.delivery_list.length, i => {
											return (
												<Dropdown.Item eventKey={i+1} key={i}>
													{i+1}
												</Dropdown.Item>
											)
											}
										)}
										</Dropdown.Menu>
									</Dropdown>{' '}
									</div>									
									<button type="button" className={`btn btn-check ${selectedOrder.includes(delivery.order_number)?'active':''}`} onClick={this.handleCheck.bind(this,delivery.order_number)}></button>
								</div>
									 }
							</div>
						)
					:'' }
				</div>:''}
				{/* <!-- ends rut-dtl-body --> */}
			</div>
		)
	}
}