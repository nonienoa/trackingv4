import React from "react";
import { Link } from "react-router-dom";
import TopNav from "../TopNav";
import DatePicker from "react-datepicker";
import moment from "moment";
import agent from "../../agent";
import { connect } from "react-redux";
import { compact, pull, chunk, replace, uniq } from "lodash";
import { Button, Toast } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  LOCATION_NAV,
  DRIVER_NAV,
  DEVICE_NAV,
  SEARCHKEY,
} from "../../constants/actionTypes";
import Loader from "../../assets/loader";

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.info,
  selectedDriver: state.info.selectedDriver,
  selectedDayField: state.info.selectedDayField,
  appName: state.common.appName,
});

const mapDispatchToProps = (dispatch) => ({
  toggleUserNav: (payload) => dispatch({ type: DRIVER_NAV, payload }),
  toggleLocationNav: (payload) => dispatch({ type: LOCATION_NAV, payload }),
  toggleDeviceNav: (payload) => dispatch({ type: DEVICE_NAV, payload }),
  // selectedDriver: (payload) =>
  //   dispatch({ type: SELECTED_DRIVER, payload }),
  setSearchkey: (payload) => dispatch({ type: SEARCHKEY, payload }),
});

class ListView extends React.Component {
  constructor() {
    super();
    this.state = {
      startDate: "",
      searchValue: "",
      driverSearch: "",
      allDelivery: [],
      filterDelivery: [],
      tableData: [],
      paginationNumber: 1,
      assigned_no: 0,
      unassigned_no: 0,
      delivering_no: 0,
      delivered_no: 0,
      cancelled_no: 0,
      total_no: 0,
      showCalendar: false,
      showSuggestion: false,
      startValue: "",
      selectedDate: moment(new Date()).format("YYYY-MM-DD"),
      sortValue: "",
      showToast: false,
      copiedUser: "",
      top: 0,
      left: 0,
      suggestions: [],
      vanList: [],
    };
    this.sortSelectRef = React.createRef();
    this.calendarRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  async componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    const vanList = await agent.BestRoute.vanList();
    const delivery = await agent.BestRoute.getDeliveryPoint(
      moment(new Date()).format("YYYY-MM-DD"),
      "",
      ""
    );
    const sortData = delivery.data.sort((a, b) =>
      a.schedule_time.localeCompare(b.schedule_time)
    );
    let filterNumbering =
      sortData.length !== 0
        ? sortData.map((d, key) => {
            d.sn = key + 1;
            return d;
          })
        : [];
    this.setState({
      allDelivery: delivery.data,
      filterDelivery: filterNumbering,
      vanList: uniq(vanList.data),
    });
    this.calculateStats();
    this.paginateDelivery();
  }

  paginateDelivery = () => {
    console.log(this.props.match.params.id)
    if (this.state.filterDelivery.length !== 0) {
      this.setState({
        tableData: [],
      });
      let data = chunk(this.state.filterDelivery, 10);
      if (this.props.match.params.id) {
        this.setState({
          tableData: data[parseInt(this.props.match.params.id) - 1],
          paginationNumber: data.length,
        });
      } else {
        this.setState({
          tableData: [],
          paginationNumber: 1,
        });
      }
    } else {
      this.setState({
        tableData: [],
        paginationNumber: 1,
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.match !== prevProps.match) {
      // console.log("props",this.props.match)
      // console.log("prec", prevProps.match)
      this.paginateDelivery();
    }
  }

  calculateStats = () => {
    let assigned = this.state.filterDelivery.map((del) => {
      if (del.order_status === "Ready for Delivery") {
        if (del.assign_vehicle) {
          return "Assigned";
        } else {
          return "Unassigned";
        }
      } else if (del.order_status === "Delivering") {
        return "Delivering";
      } else if (del.order_status === "Delivered") {
        return "Delivered";
      } else if (del.order_status === "Cancelled") {
        return "Cancelled";
      }
      return null;
    });
    this.setState({
      total_no: assigned.length,
      assigned_no: assigned.length - pull(assigned, "Assigned").length,
      unassigned_no: assigned.length - pull(assigned, "Unassigned").length,
      delivering_no: assigned.length - pull(assigned, "Delivering").length,
      delivered_no: assigned.length - pull(assigned, "Delivered").length,
      cancelled_no: assigned.length - pull(assigned, "Cancelled").length,
    });
    if (this.props.match.url !== "/list-view/1") {
      this.props.history.push("/list-view/1");
    }
  };

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
    if (this.suggestionRef) {
      if (!this.suggestionRef.current.contains(event.target)) {
        this.setState({
          showSuggestion: false,
        });
      }
    }
  }

  orderStatusImg(del) {
    if (del.order_status === "Ready for Delivery") {
      if (del.assign_vehicle) {
        return "/images/icons/icon-mark-assigned.svg";
      } else {
        return "/images/icons/icon-mark-unassigned.svg";
      }
    } else if (del.order_status === "Delivering") {
      return "/images/icons/icon-mark-delivering.svg";
    } else if (del.order_status === "Delivered") {
      return "/images/icons/icon-mark-delivered.svg";
    } else if (del.order_status === "Cancelled") {
      return "/images/icons/icon-mark-cancelled.svg";
    }
  }

  orderStatus(del) {
    if (del.order_status === "Ready for Delivery") {
      if (del.assign_vehicle) {
        return <span style={{ color: "#B0ACD1" }}>Assigned</span>;
      } else {
        return <span style={{ color: "#F5C315" }}>Unassigned</span>;
      }
    } else if (del.order_status === "Delivering") {
      return <span style={{ color: "#89BFE4" }}>Delivering</span>;
    } else if (del.order_status === "Delivered") {
      return <span style={{ color: "#8ED2C9" }}>Delivered</span>;
    } else if (del.order_status === "Cancelled") {
      return <span style={{ color: "#F0A79E" }}>Cancelled</span>;
    }
  }

  filterData = async (date, sort, search, driverSearch) => {
    let data = await agent.BestRoute.searchDeliveryPoint(search);
    let dateFilterData = data
      ? data.data.map((delivery) => {
          if (delivery.schedule_date === date) {
            return delivery;
          }
          if (date === "") {
            return delivery;
          }
          return null;
        })
      : [];
    let sortFilterData = compact(dateFilterData).map((delivery, Key) => {
      delivery["sn"] = Key + 1;
      if (sort === "unassigned") {
        if (delivery.order_status === "Ready for Delivery") {
          if (!delivery.assign_vehicle) {
            return delivery;
          }
        }
      }
      if (sort === "delivering") {
        if (delivery.order_status === "Delivering") {
          return delivery;
        }
      }
      if (sort === "delivered") {
        if (delivery.order_status === "Delivered") {
          return delivery;
        }
      }
      if (sort === "assigned") {
        if (delivery.order_status === "Ready for Delivery") {
          if (delivery.assign_vehicle) {
            return delivery;
          }
        }
      }
      if (sort === "cancelled") {
        if (delivery.order_status === "Cancelled") {
          return delivery;
        }
      }
      if (sort === "") {
        return delivery;
      }
      return null;
    });
    let driverFilter =
      driverSearch !== ""
        ? compact(sortFilterData).filter(
            (d) =>
              d.assign_vehicle &&
              d.assign_vehicle
                .toLowerCase()
                .includes(driverSearch.toLowerCase())
          )
        : compact(sortFilterData);
    const sortData = compact(driverFilter).sort((a, b) =>
      a.schedule_time.localeCompare(b.schedule_time)
    );
    let filterNumbering =
      sortData.length !== 0
        ? sortData.map((d, key) => {
            d.sn = key + 1;
            return d;
          })
        : [];
    return compact(filterNumbering);
  };

  onDateChange = async (e) => {
    let date = moment(e).format("YYYY-MM-DD");
    this.setState({
      startDate: e,
      selectedDate: date,
    });
  };

  handleSearch = async (e) => {
    e.persist();
    this.setState({
      searchValue: e.target.value,
    });
  };

  toggleCalendar = () => {
    this.setState({
      showCalendar: !this.state.showCalendar,
    });
  };

  handleSet = async () => {
    this.setState({
      filterStart: true,
    });
    let filterData = await this.filterData(
      this.state.selectedDate,
      this.state.sortValue,
      this.state.searchValue,
      this.state.driverSearch
    );
    this.setState({
      filterDelivery: filterData,
    });
    this.calculateStats();
    this.paginateDelivery();
    this.setState({
      filterStart: false,
    });
  };
  handleClear = async () => {
    this.setState({
      searchValue: "",
      driverSearch: "",
      sortValue: "",
      filterStart: true,
    });
    document.getElementById("my_select").selectedIndex = 0;
    let filterData = await this.filterData(this.state.selectedDate, "", "", "");
    this.setState({
      filterDelivery: filterData,
    });
    this.calculateStats();
    this.paginateDelivery();
    this.setState({
      filterStart: false,
    });
  };

  handleSortChange = async (e) => {
    e.persist();
    this.setState({
      sortValue: e.target.value,
    });
  };

  onCopy = (e) => {
    this.setState({
      showToast: true,
      copiedUser: e,
    });
  };

  handleDriverSearch = async (e) => {
    this.setState({
      driverSearch: e,
    });
    let driverData = this.state.vanList.map((d) => {
      if (
        `${d.name}(${d.vehicle_code})`.toLowerCase().includes(e.toLowerCase())
      ) {
        let bold = e.toUpperCase();
        return replace(`${d.name}(${d.vehicle_code})`, e, bold);
      }
      return null;
    });
    this.setState({
      suggestions: compact(driverData),
    });
  };

  render() {
    const {
      startDate,
      searchValue,
      showCalendar,
      paginationNumber,
      suggestions,
      assigned_no,
      unassigned_no,
      delivered_no,
      delivering_no,
      cancelled_no,
      showSuggestion,
      filterStart,
      tableData,
      showToast,
      driverSearch,
      total_no,
    } = this.state;
    return (
      <div>
        <TopNav
          toggleUserNav={this.props.toggleUserNav}
          toggleLocationNav={this.props.toggleLocationNav}
          toggleDeviceNav={this.props.toggleDeviceNav}
          driverNav={this.props.driverNav}
          deviceNav={this.props.deviceNav}
          locationNav={this.props.locationNav}
          driverList={this.props.driverList}
          selectedDriver={this.props.selectedDriver}
          history={this.props}
          setSearchkey={this.props.setSearchkey}
        />
        <div className="order-list-sec">
          <div className="inner-order-list-sec">
            <div className="order-list-container">
              <div className="order-block">
                <div className="order-head">
                  <div className="order-head-left left-width">
                    <div className="order-srch-block">
                      <div className="input-group">
                        <input
                          type="text"
                          value={searchValue}
                          className="form-control"
                          id="inlineFormInputGroup"
                          placeholder="Search Your Order"
                          onChange={this.handleSearch}
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <button type="button" className="btn btn-srch-odr">
                              <i
                                className="fa fa-search"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <!-- ends order-srch-block --> */}
                  </div>
                  {/* <!-- ends order-head-left --> */}
                  <div className="order-head-right">
                    <div className="date-sort-block">
                      <Button
                        className="btn-primary-override"
                        style={{
                          backgroundColor: "#fff",
                          display: "flex",
                          alignItems: "center",
                          color: "grey",
                          border: "1px solid #fff",
                          marginBottom: "16px",
                          marginRight: "4px",
                        }}
                        onClick={() =>
                          this.onDateChange(
                            new Date(
                              new Date().setDate(new Date().getDate() - 1)
                            )
                          )
                        }
                      >
                        <span>
                          <img
                            src="/images/icons/icon-unassigned.svg"
                            alt="unassigned"
                            height="25px"
                            width="25px"
                          />
                        </span>
                        <span className="ml-1">Yesterday</span>
                      </Button>
                      <Button
                        className="btn-primary-override"
                        style={{
                          backgroundColor: "#fff",
                          display: "flex",
                          alignItems: "center",
                          color: "grey",
                          border: "1px solid #fff",
                          marginBottom: "16px",
                        }}
                        onClick={() => this.onDateChange(new Date())}
                      >
                        <span>
                          <img
                            src="/images/icons/icon-unassigned.svg"
                            alt="unassigned"
                            height="25px"
                            width="25px"
                          />
                        </span>
                        <span className="ml-1">Today</span>
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                      <div className="date-sort-item">
                        <div className="date-grp date-grp-date">
                          <div className="input-group">
                            <div
                              className="input-group-prepend"
                              onClick={this.toggleCalendar}
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
                              onFocus={() =>
                                this.setState({ showCalendar: true })
                              }
                              className="form-control"
                              id="inlineFormInputGroup"
                              placeholder={
                                startDate
                                  ? moment(startDate).format("MM/DD/YYYY")
                                  : "Select Date"
                              }
                            />
                            <div
                              style={{
                                position: "fixed",
                                top: "137px",
                                zIndex: "999",
                              }}
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
                        {/* <!-- ends date-grp --> */}
                      </div>
                      {/* <!-- ends date-sort-item --> */}
                      <div className="date-sort-item">
                        <div className="date-grp">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <div className="input-group-text">
                                <img
                                  src="/images/icons/icon-filter-sort.svg"
                                  alt="filter sort"
                                />
                              </div>
                            </div>
                            <select
                              ref={this.sortSelectRef}
                              id="my_select"
                              className="form-control"
                              onChange={this.handleSortChange}
                            >
                              <option value="">Order Sort By All</option>
                              <option value="delivered">
                                Order Sort By Delivered
                              </option>
                              <option value="delivering">
                                Order Sort By Delivering
                              </option>
                              <option value="assigned">
                                Order Sort By Assigned
                              </option>
                              <option value="unassigned">
                                Order Sort By Unassigned
                              </option>
                              <option value="cancelled">
                                Order Sort By Cancelled
                              </option>
                            </select>
                          </div>
                        </div>
                        {/* <!-- ends date-grp --> */}
                      </div>
                      <div className="date-sort-item">
                        <div className="order-srch-block">
                          <div className="input-group">
                            <input
                              type="text"
                              value={driverSearch}
                              onFocus={() =>
                                this.setState({ showSuggestion: true })
                              }
                              className="form-control"
                              id="inlineFormInputGroup"
                              placeholder="Search By Driver"
                              onChange={(e) => {
                                e.persist();
                                this.handleDriverSearch(e.target.value);
                              }}
                            />
                            <div className="input-group-append">
                              <div className="input-group-text">
                                <button
                                  type="button"
                                  className="btn btn-srch-odr"
                                >
                                  <i
                                    className="fa fa-search"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div ref={this.suggestionRef}>
                          {showSuggestion ? (
                            driverSearch !== "" ? (
                              suggestions.length !== 0 ? (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "74px",
                                    width: "18%",
                                    height: "250px",
                                    overflowY: "scroll",
                                    backgroundColor: "#fff",
                                    zIndex: "999",
                                    border: "solid 1px #aeaeae",
                                    padding: "10px",
                                    fontSize: "13px",
                                    borderRadius: "5px",
                                    color: "#878787",
                                  }}
                                >
                                  {suggestions.map((suggestion, Key) => (
                                    <div
                                      key={Key}
                                      style={{
                                        padding: "5px",
                                        borderBottom: "1px solid grey",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        this.handleDriverSearch(suggestion);
                                        this.setState({
                                          showSuggestion: false,
                                        });
                                      }}
                                    >
                                      {" "}
                                      {suggestion}{" "}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <Button
                        variant="success"
                        style={{
                          borderRadius: "10px",
                          height: "57px",
                          width: "60px",
                          marginBottom: "16px",
                        }}
                        onClick={() => this.handleSet()}
                      >
                        Go
                      </Button>
                      &nbsp;
                      <Button
                        variant="danger"
                        style={{
                          borderRadius: "10px",
                          height: "57px",
                          marginBottom: "16px",
                        }}
                        onClick={() => this.handleClear()}
                      >
                        Clear
                      </Button>
                      {/* <!-- ends date-sort-item --> */}
                    </div>
                    {/* <!-- ends date-sort-block --> */}
                  </div>
                  {/* <!-- ends order-head-right --> */}
                </div>
                {/* <!-- ends order-head --> */}
                <div className="order-body">
                  <div className="order-body-left left-width">
                    <div className="order-assign-block">
                      <div className="order-assign-item order-unassigned">
                        <h3>Unassigned</h3>
                        <div className="order-assign-item-inner">
                          <span className="spn-order-icon">
                            <img
                              src="/images/icons/icon-unassigned.svg"
                              alt="unassigned"
                            />
                          </span>
                          <div className="order-assign-num">
                            <p>
                              {unassigned_no < 10
                                ? `0${unassigned_no}`
                                : unassigned_no}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* <!-- ends order-assign-item --> */}
                      <div className="order-assign-item order-assigned">
                        <h3>Assigned</h3>
                        <div className="order-assign-item-inner">
                          <span className="spn-order-icon">
                            <img
                              src="/images/icons/icon-assigned.svg"
                              alt="assigned"
                            />
                          </span>
                          <div className="order-assign-num">
                            <p>
                              {assigned_no < 10
                                ? `0${assigned_no}`
                                : assigned_no}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* <!-- ends order-assign-item --> */}
                      <div className="order-assign-item order-delivering">
                        <h3>Delivering</h3>
                        <div className="order-assign-item-inner">
                          <span className="spn-order-icon">
                            <img
                              src="/images/icons/icon-delivering.svg"
                              alt="delivering"
                            />
                          </span>
                          <div className="order-assign-num">
                            <p>
                              {delivering_no < 10
                                ? `0${delivering_no}`
                                : delivering_no}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* <!-- ends order-assign-item --> */}
                      <div className="order-assign-item order-delivered">
                        <h3>Delivered</h3>
                        <div className="order-assign-item-inner">
                          <span className="spn-order-icon">
                            <img
                              src="/images/icons/icon-delivered.svg"
                              alt="delivered"
                            />
                          </span>
                          <div className="order-assign-num">
                            <p>
                              {delivered_no < 10
                                ? `0${delivered_no}`
                                : delivered_no}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* <!-- ends order-assign-item --> */}
                      <div className="order-assign-item order-cancel">
                        <h3>Cancelled</h3>
                        <div className="order-assign-item-inner">
                          <span className="spn-order-icon">
                            <img
                              src="/images/icons/delivery-cancel.svg"
                              alt="delivered"
                            />
                          </span>
                          <div className="order-assign-num">
                            <p>
                              {cancelled_no < 10
                                ? `0${cancelled_no}`
                                : cancelled_no}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* <!-- ends order-assign-item --> */}
                      <div className="order-assign-item order-total">
                        <h3>Total</h3>
                        <div className="order-assign-item-inner">
                          <span className="spn-order-icon">
                            <img
                              src="/images/icons/total-box.svg"
                              alt="delivered"
                            />
                          </span>
                          <div className="order-assign-num">
                            <p>{total_no < 10 ? `0${total_no}` : total_no}</p>
                          </div>
                        </div>
                      </div>
                      {/* <!-- ends order-assign-item --> */}
                    </div>
                    {/* <!-- ends order-assign-block --> */}
                  </div>
                  {/* <!-- ends order-body-left --> */}
                  <div className="order-body-right">
                    <div className="tbl-order">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>S.N.</th>
                              <th>Recipient</th>
                              <th>Phone</th>
                              <th>Driver Name</th>
                              <th>Request Date</th>
                              <th>Schedule Date</th>
                              <th>Status</th>
                              <th>
                                <Toast
                                  style={{
                                    width: "60px",
                                    fontSize: "10px",
                                  }}
                                  onClose={() =>
                                    this.setState({ showToast: false })
                                  }
                                  show={showToast}
                                  delay={500}
                                  autohide
                                >
                                  <Toast.Body>Copied</Toast.Body>
                                </Toast>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {!filterStart ? (
                              tableData.length !== 0 ? (
                                tableData.map((del, Key) => (
                                  <tr key={Key}>
                                    <td>{del.sn}</td>
                                    <td>{del.customer_name || "N/A"}</td>
                                    <td>{del.customer_number || "N/A"}</td>
                                    <td>
                                      {del.assign_vehicle
                                        ? del.assign_vehicle.split("-")[0]
                                        : "N/A"}
                                    </td>
                                    <td>
                                      {del.order_date}
                                      <small>({del.order_time})</small>
                                    </td>
                                    <td>
                                      {del.schedule_date}
                                      <small>({del.schedule_time})</small>
                                    </td>
                                    <td className="text-nowrap">
                                      <span className="spn-dlv">
                                        <img
                                          src={this.orderStatusImg(del)}
                                          alt={this.orderStatusImg(del)}
                                          height="12"
                                          width="15"
                                        />
                                      </span>
                                      {this.orderStatus(del)}
                                    </td>
                                    <td>
                                      <CopyToClipboard
                                        text={del.customer_name}
                                        onCopy={() =>
                                          this.onCopy(del.customer_name)
                                        }
                                      >
                                        <span className="spn-copy active">
                                          <i
                                            className="fa fa-clone"
                                            aria-hidden="true"
                                          ></i>
                                        </span>
                                      </CopyToClipboard>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="8"
                                    style={{ textAlign: "center" }}
                                  >
                                    No Order Today
                                  </td>
                                </tr>
                              )
                            ) : (
                              <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>
                                  <Loader />
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* <!-- ends tbl-order --> */}
                    {parseInt(paginationNumber) !== 1 ? (
                      <div className="pagin-sec">
                        <nav aria-label="...">
                          <ul className="pagination">
                            <li
                              className={`page-item ${
                                parseInt(this.props.match.params.id) === 1
                                  ? "disabled"
                                  : ""
                              }`}
                            >
                              <Link
                                className="page-link"
                                to={`${
                                  parseInt(this.props.match.params.id) - 1
                                }`}
                              >
                                <i
                                  className="fa fa-angle-left"
                                  aria-hidden="true"
                                ></i>
                              </Link>
                            </li>
                            {parseInt(this.props.match.params.id) > 2 ? (
                              <li className="page-item">
                                <Link className="page-link" to="1">
                                  1
                                </Link>
                              </li>
                            ) : (
                              ""
                            )}
                            {parseInt(this.props.match.params.id) - 3 > 0 ? (
                              <li className="page-item">
                                <Link
                                  className="page-link page-dot-left"
                                  to={`${
                                    parseInt(this.props.match.params.id) - 1
                                  }`}
                                >
                                  ...
                                </Link>
                              </li>
                            ) : (
                              ""
                            )}
                            {parseInt(this.props.match.params.id) > 1 ? (
                              <li className="page-item">
                                <Link
                                  className="page-link"
                                  to={`${
                                    parseInt(this.props.match.params.id) - 1
                                  }`}
                                >
                                  {parseInt(this.props.match.params.id) - 1}
                                </Link>
                              </li>
                            ) : (
                              ""
                            )}
                            <li
                              className="page-item active"
                              aria-current="page"
                            >
                              <Link
                                className="page-link"
                                to={`${parseInt(this.props.match.params.id)}`}
                              >
                                {parseInt(this.props.match.params.id)}{" "}
                                <span className="sr-only">(current)</span>
                              </Link>
                            </li>
                            {parseInt(this.props.match.params.id) + 1 <=
                            parseInt(paginationNumber) ? (
                              <li className="page-item">
                                <Link
                                  className="page-link"
                                  to={`${
                                    parseInt(this.props.match.params.id) + 1
                                  }`}
                                >
                                  {parseInt(this.props.match.params.id) + 1}
                                </Link>
                              </li>
                            ) : (
                              ""
                            )}
                            {parseInt(this.props.match.params.id) + 3 <=
                            parseInt(paginationNumber) ? (
                              <li className="page-item">
                                <Link
                                  className="page-link page-dot-right"
                                  to={`${
                                    parseInt(this.props.match.params.id) + 1
                                  }`}
                                >
                                  ...
                                </Link>
                              </li>
                            ) : (
                              ""
                            )}
                            {parseInt(this.props.match.params.id) + 2 <=
                            parseInt(paginationNumber) ? (
                              <li className="page-item">
                                <Link
                                  className="page-link"
                                  to={`${paginationNumber}`}
                                >
                                  {paginationNumber}
                                </Link>
                              </li>
                            ) : (
                              ""
                            )}
                            <li
                              className={`page-item ${
                                parseInt(this.props.match.params.id) ===
                                parseInt(paginationNumber)
                                  ? "disabled"
                                  : ""
                              }`}
                            >
                              <Link
                                className="page-link"
                                to={`${
                                  parseInt(this.props.match.params.id) + 1
                                }`}
                              >
                                <i
                                  className="fa fa-angle-right"
                                  aria-hidden="true"
                                ></i>
                              </Link>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
