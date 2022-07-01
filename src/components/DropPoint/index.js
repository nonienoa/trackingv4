import React, { Component } from "react";
import SelectedPickUpPoint from "./selectedPickupPoint";
import SelectedStartPoint from "./selectedStartPoint";
import CalendarIcon from "./calendarIcon";
import ApiSuccess from "../BestRoute/apiSucess";
import { connect } from "react-redux";
import agent from "../../agent";
import moment from "moment";
import DatePicker from "react-datepicker";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { compact, find, isEmpty, filter, pull } from "lodash";
import {
  TOTAL_DELIVERY,
  PICKUP_POINT,
  SELECT_PICKUP,
  SELECTED_ORDER,
  SELECTED_ORDER_POINT,
  DESTINATION_POINT,
  DROP_TAB,
  MAP_CHANGE,
  SELECT_STATUS,
} from "../../constants/actionTypes";

//import Images
import Pickup from "../../assets/images/icons/icon-pickup.svg";
import Destination from "../../assets/images/icons/icon-destination.svg";
import Bhojan from "../../assets/images/img-bhojan.png";
import Loader from "../../assets/loader";

const mapStateToProps = (state) => ({
  ...state.info,
  ...state.bestRoute,
  ...state.dropPoint,
  ...state.common,
});

const mapDispatchToProps = (dispatch) => ({
  allDeliveryPoint: (payload) => dispatch({ type: TOTAL_DELIVERY, payload }),
  pickupPoints: (payload) => dispatch({ type: PICKUP_POINT, payload }),
  selectPickup: (payload) => dispatch({ type: SELECT_PICKUP, payload }),
  selectOrder: (payload) => dispatch({ type: SELECTED_ORDER, payload }),
  selectOrderPoint: (payload) =>
    dispatch({ type: SELECTED_ORDER_POINT, payload }),
  passDestination: (payload) => dispatch({ type: DESTINATION_POINT, payload }),
  passTabName: (payload) => dispatch({ type: DROP_TAB, payload }),
  zoomToMarker: (payload) => dispatch({ type: MAP_CHANGE, payload }),
  selectStatus: (payload) => dispatch({ type: SELECT_STATUS, payload }),
});

class DropPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSideBar: true,
      stationList: [],
      destinationList: [],
      vanList: [],
      totalStation: [],
      tabName: "both",
      startFetch: false,
      startDate: new Date(),
      showCalendar: false,
      selectedStatus: ["delivering", "assigned", "unassigned"],
      searchValue: "",
      displayOrders: [],
      displayStation: [],
      selectedDriver: "",
    };
    this.calendarRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  async componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    const vanList = await agent.BestRoute.vanList();
    this.setState({
      vanList: vanList.data,
    });
    this.onDateChange(new Date());
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedDriver !== prevProps.selectedDriver) {
      this.setState({
        selectedDriver: this.props.selectedDriver,
      });
      this.onDateChange(this.state.startDate);
    }
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.calendarRef) {
      if (!this.calendarRef.current.contains(event.target)) {
        this.setState({
          showCalendar: false,
        });
      }
    }
  }

  toggleSideBar = () => {
    this.setState({
      showSideBar: !this.state.showSideBar,
    });
  };

  onPickupClick = (station) => {
    this.props.zoomToMarker({
      center: {
        lng: station.geojson.coordinates[0],
        lat: station.geojson.coordinates[1],
      },
      zoom: 14,
    });
    let order = this.props.allDeliveryPoints.map((delivery) => {
      if (delivery.warehouse.split(",").includes(station.name)) {
        return delivery;
      }
      return null;
    });
    console.log("order", order)
    this.props.selectPickup(station.geojson);
    this.props.selectOrder([]);
    window.setTimeout(() => {
      this.props.selectOrder(compact(order));
    }, 200);
    this.props.selectOrderPoint({});
    console.log("sele",this.props.selectedOrders)
  };

  loadAllPoint = () => {
    this.props.selectPickup({});
    this.props.selectOrder([]);
    this.props.selectOrderPoint({});
    this.props.pickupPoints(this.state.stationList);
  };

  handleTabChange = (tabName) => {
    this.setState({
      tabName,
    });
    this.props.passTabName(tabName);
  };

  handleStatusChange = (status) => {
    if (this.state.selectedStatus.includes(status)) {
      let removedStatus = this.state.selectedStatus;
      pull(removedStatus, status);
      this.setState({
        selectedStatus: removedStatus,
      });
    } else {
      let addStatus = this.state.selectedStatus;
      addStatus.push(status);
      this.setState({
        selectedStatus: addStatus,
      });
    }
    this.onDateChange(this.state.startDate);
  };

  filterByDriver = (status) => {};

  loadList(tabName) {
    const { stationList, destinationList, startFetch, displayStation } =
      this.state;
    if (tabName === "pickup") {
      return (
        <PickupList
          stationList={stationList}
          onPickupClick={this.onPickupClick}
          loadAllPoint={this.loadAllPoint}
          allDeliveryPoints={this.props.allDeliveryPoints}
          selectedPickup={this.props.selectedPickup}
          startFetch={startFetch}
          displayStation={displayStation}
        />
      );
    }
    if (tabName === "destination") {
      return (
        <DestinationList
          destinationList={destinationList}
          allDeliveryPoints={this.props.allDeliveryPoints}
          setZoom={this.setZoom}
          selectedOrderPoint={this.props.selectedOrderPoint}
          startFetch={startFetch}
          displayOrders={this.state.displayOrders}
        />
      );
    }
    if (tabName === "both") {
      return (
        <>
          <PickupList
            stationList={stationList}
            onPickupClick={this.onPickupClick}
            loadAllPoint={this.loadAllPoint}
            allDeliveryPoints={this.props.allDeliveryPoints}
            selectedPickup={this.props.selectedPickup}
            startFetch={startFetch}
            displayStation={displayStation}
          />
        </>
      );
    }
  }

  setZoom = (unassign) => {
    let zoom = {
      zoom: 18,
      center: {
        lng: unassign.geojson.coordinates[0],
        lat: unassign.geojson.coordinates[1],
      },
    };
    this.props.zoomToMarker(zoom);
    this.props.selectOrderPoint(unassign);
  };

  onDateChange = async (e) => {
    this.setState({
      startDate: e,
      startFetch: true,
    });
    // console.log("startdate", this.state.startDate)
    this.props.selectPickup({});
    this.props.selectOrder([]);
    this.props.selectOrderPoint({});
    this.props.passDestination([]);
    this.props.pickupPoints([]);
    let stationList = await agent.BestRoute.getStation("", "");
    const apiResponse = await agent.BestRoute.getDeliveryPoint(
      moment(e).format("YYYY-MM-DD"),
      "",
      ""
    );
    let delivery = apiResponse.data;
    if (this.state.selectedDriver) {
      delivery = compact(
        delivery.map((del) => {
          if (
            del.assign_vehicle
              ? del.assign_vehicle.includes(this.state.selectedDriver.firstName)
              : false
          ) {
            return del;
          }
          return null;
        })
      );
    }
    const finalDelivery = compact(
      delivery.map((del) => {
        if (this.state.selectedStatus.includes("delivered")) {
          if (del.order_status === "Delivered") {
            return del;
          }
        }
        if (this.state.selectedStatus.includes("delivering")) {
          if (del.order_status === "Delivering") {
            return del;
          }
        }
        if (this.state.selectedStatus.includes("assigned")) {
          if (del.order_status === "Ready for Delivery") {
            if (del.assign_vehicle) {
              return del;
            }
          }
        }
        if (this.state.selectedStatus.includes("unassigned")) {
          if (del.order_status === "Ready for Delivery") {
            if (!del.assign_vehicle) {
              return del;
            }
          }
        }
        if (this.state.selectedStatus.includes("cancelled")) {
          if (del.order_status === "Cancelled") {
            return del;
          }
        }
        if (this.state.selectedStatus.length === 0) {
          return del;
        }
        return null;
      })
    );
    this.props.allDeliveryPoint(finalDelivery);
    let destination = finalDelivery
      ? finalDelivery.map((d) => {
          if (d.warehouse) {
            return d;
          }
          return null;
        })
      : [];
    let activeStation = stationList.data.available.map((station) => {
      if (
        find(this.props.allDeliveryPoints, (d) =>
          d.warehouse.split(",").includes(station.name)
        )
      ) {
        return station;
      }
      return null;
    });
    this.setState({
      totalStation: stationList.data.available,
      stationList: compact(activeStation),
      destinationList: compact(destination),
      displayStation: compact(activeStation),
      displayOrders: compact(destination),
      startFetch: false,
    });
    this.handleSearch(this.state.searchValue);
  };

  handleSearch = (e) => {
    this.setState({
      searchValue: e,
    });
    this.props.selectOrder([]);
    this.props.passDestination([]);
    this.props.pickupPoints([]);
    let displayOrders = filter(this.state.destinationList, (d) => {
      return d.order_number.toLowerCase().indexOf(e.toLowerCase()) !== -1;
    });
    let displayStation = this.state.stationList.map((station) => {
      if (
        find(displayOrders, (d) =>
          d.warehouse.split(",").includes(station.name)
        )
      ) {
        return station;
      }
      return null;
    });
    window.setTimeout(() => {
      this.props.passDestination(displayOrders);
      this.props.pickupPoints(compact(displayStation));
    }, 200);
    this.setState({
      displayOrders,
      displayStation: compact(displayStation),
    });
  };

  render() {
    const {
      showSideBar,
      tabName,
      selectedStatus,
      showCalendar,
      startDate,
      searchValue,
      totalStation,
    } = this.state;
    return (
      <>
        <ApiSuccess />
        <SelectedPickUpPoint vanList={this.state.vanList} />
        <SelectedStartPoint
          vanList={this.state.vanList}
          startDate={startDate}
          totalStation={totalStation}
        />
        <div className={`left-pickup-sec ${showSideBar ? "show" : ""}`}>
          <button
            type="button"
            className="btn btn-toggle-arw"
            onClick={this.toggleSideBar}
          >
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          <div className="left-pickup-inner">
            <div className="pickup-tab">
              <button
                type="button"
                className={`btn btn-pickup ${
                  tabName === "pickup" ? "active" : ""
                }`}
                onClick={this.handleTabChange.bind(this, "pickup")}
              >
                <img src={Pickup} alt="pickup point" />
              </button>
              <button
                type="button"
                className={`btn btn-pickup ${
                  tabName === "destination" ? "active" : ""
                }`}
                onClick={this.handleTabChange.bind(this, "destination")}
              >
                <img src={Destination} alt="destination" />
              </button>
              <button
                type="button"
                className={`btn btn-pickup ${
                  tabName === "both" ? "active" : ""
                }`}
                onClick={this.handleTabChange.bind(this, "both")}
              >
                Both
              </button>
            </div>
            <div className="pickup-tab">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id={`tooltip-bottom`}>Delivered</Tooltip>}
              >
                <button
                  type="button"
                  style={{ backgroundColor: "#8ED2C9", height: "34px" }}
                  className={`btn btn-pickup ${
                    selectedStatus.includes("delivered") ? "color_active" : ""
                  }`}
                  onClick={this.handleStatusChange.bind(this, "delivered")}
                >
                  {selectedStatus.includes("delivered") ? (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  ) : (
                    ""
                  )}
                </button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id={`tooltip-bottom`}>Delivering</Tooltip>}
              >
                <button
                  type="button"
                  style={{ backgroundColor: "#89BFE4", height: "34px" }}
                  className={`btn btn-pickup ${
                    selectedStatus.includes("delivering") ? "color_active" : ""
                  }`}
                  onClick={this.handleStatusChange.bind(this, "delivering")}
                >
                  {selectedStatus.includes("delivering") ? (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  ) : (
                    ""
                  )}
                </button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id={`tooltip-bottom`}>Assigned</Tooltip>}
              >
                <button
                  type="button"
                  style={{ backgroundColor: "#B0ACD1", height: "34px" }}
                  className={`btn btn-pickup ${
                    selectedStatus.includes("assigned") ? "color_active" : ""
                  }`}
                  onClick={this.handleStatusChange.bind(this, "assigned")}
                >
                  {selectedStatus.includes("assigned") ? (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  ) : (
                    ""
                  )}
                </button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id={`tooltip-bottom`}>Unassigned</Tooltip>}
              >
                <button
                  type="button"
                  style={{ backgroundColor: "#F5C315", height: "34px" }}
                  className={`btn btn-pickup ${
                    selectedStatus.includes("unassigned") ? "color_active" : ""
                  }`}
                  onClick={this.handleStatusChange.bind(this, "unassigned")}
                >
                  {selectedStatus.includes("unassigned") ? (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  ) : (
                    ""
                  )}
                </button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id={`tooltip-bottom`}>Cancelled</Tooltip>}
              >
                <button
                  type="button"
                  style={{ backgroundColor: "#F0A79E", height: "34px" }}
                  className={`btn btn-pickup ${
                    selectedStatus.includes("cancelled") ? "color_active" : ""
                  }`}
                  onClick={this.handleStatusChange.bind(this, "cancelled")}
                >
                  {selectedStatus.includes("cancelled") ? (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  ) : (
                    ""
                  )}
                </button>
              </OverlayTrigger>
            </div>
            <div style={{ display: "flex", padding: "10px", flexShrink: "0" }}>
              <button
                type="button"
                className="btn-date-month"
                onClick={() => this.onDateChange(new Date())}
              >
                <CalendarIcon
                  date={[moment().format("DD"), moment().format("MMM")]}
                />
              </button>
              <div
                className="date-grp date-grp-date"
                style={{
                  width: "258px",
                  margin: "0px 16px 9px 6px",
                  border: "1px solid grey",
                  minHeight: "55px",
                }}
              >
                <div className="input-group">
                  <div
                    className="input-group-prepend"
                    onClick={() =>
                      this.setState({ showCalendar: !this.state.showCalendar })
                    }
                  >
                    <div className="input-group-text">
                      <img
                        src="/images/icons/icon-filter-date.svg"
                        alt="filter date"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    onFocus={() => this.setState({ showCalendar: true })}
                    style={{ fontSize: "18px" }}
                    className="form-control"
                    id="inlineFormInputGroup"
                    placeholder={
                      startDate
                        ? moment(startDate).format("MM/DD/YYYY")
                        : "Select Date"
                    }
                  />
                  <div
                    style={{ position: "fixed", top: "188px", zIndex: "999" }}
                    ref={this.calendarRef}
                  >
                    {showCalendar ? (
                      <DatePicker
                        selected={startDate}
                        onChange={this.onDateChange}
                        inline
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="pickup-search">
              {/* <form> */}
              <div className="srch-group">
                <input
                  type="text"
                  value={searchValue}
                  className="form-control"
                  id="inlineFormInputGroupUsername2"
                  placeholder="Search"
                  onChange={(e) => this.handleSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-srch">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </div>
              {/* </form> */}
            </div>
            {this.loadList(tabName)}
          </div>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropPoint);

export class PickupList extends React.Component {
  totalOrder(station) {
    let order = this.props.allDeliveryPoints.map((delivery) => {
      if (delivery.warehouse.split(",").includes(station)) {
        return delivery;
      }
      return null;
    });
    return compact(order).length;
  }
  render() {
    const {
      displayStation,
      onPickupClick,
      loadAllPoint,
      selectedPickup,
      startFetch,
    } = this.props;
    // console.log("display", displayStation);
    return (
      <div className="pickup-dtl">
        <div className="pickup-head">
          <span className="pickup-head-dot"></span>
          <p style={{ cursor: "pointer" }} onClick={loadAllPoint}>
            Total Pick up Points ( {displayStation.length} )
          </p>
        </div>
        <div className="pickup-body">
          {!startFetch ? (
            displayStation.length !== 0 ? (
              displayStation.map((station, Key) => (
                <div className="pickup-item" key={Key}>
                  <span className="pickup-img">
                    <img src={Bhojan} alt="bhojan" />
                  </span>
                  <div className="pickup-title">
                    <h4
                      style={{
                        cursor: "pointer",
                        fontWeight: !isEmpty(selectedPickup)
                          ? selectedPickup === station.geojson
                            ? 700
                            : ""
                          : "",
                      }}
                      onClick={onPickupClick.bind(this, station)}
                    >
                      {station.name}
                    </h4>
                    {/* <p><span className="lcl-dots"></span><span className="lcl-txt">Sanepa chowk</span></p> */}
                  </div>
                  <div className="lcl-num-div">
                    <span className="spn-lcl-num">
                      {this.totalOrder(station.name)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div>No Order Today</div>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
    );
  }
}

export class DestinationList extends React.Component {
  render() {
    const { setZoom, startFetch, selectedOrderPoint, displayOrders } =
      this.props;
    return (
      <div className="pickup-dtl">
        <div className="pickup-head">
          <span className="pickup-head-dot-destination"></span>
          <p>Total Destination ( {displayOrders.length} )</p>
        </div>
        <div className="pickup-body">
          {!startFetch ? (
            displayOrders.length !== 0 ? (
              displayOrders.map((dest, Key) => (
                <div
                  className="pickup-item"
                  key={Key}
                  style={{
                    cursor: "pointer",
                    fontWeight: !isEmpty(selectedOrderPoint)
                      ? selectedOrderPoint === dest
                        ? 700
                        : ""
                      : "",
                  }}
                  onClick={setZoom.bind(this, dest)}
                >
                  <div className="pickup-title">
                    <h4
                      style={{
                        fontWeight: !isEmpty(selectedOrderPoint)
                          ? selectedOrderPoint === dest
                            ? 700
                            : ""
                          : "",
                      }}
                    >
                      {dest.location}
                    </h4>
                    <p
                      style={{
                        fontWeight: !isEmpty(selectedOrderPoint)
                          ? selectedOrderPoint === dest
                            ? 700
                            : ""
                          : "",
                      }}
                    >
                      <span className="lcl-txt">{dest.order_number}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div>No Order Today</div>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
    );
  }
}
