import React, { Component } from 'react'
import { connect } from 'react-redux';
import { HOVERED_ORDER_POINT, SELECTED_ORDER, SELECT_PICKUP } from '../../constants/actionTypes';
// import Shift from '../../assets/images/icons/icon-shift-sm.svg'
import KFC from '../../assets/images/restaurant2.png'
import Close from '../../assets/images/close.svg';

const mapStateToProps = state => ({
    ...state.dropPoint
})

const mapDispatchToProps = dispatch => ({
    passHoverPoint: (payload) =>
        dispatch({ type: HOVERED_ORDER_POINT, payload }),
    selectOrder: (payload) =>
        dispatch({ type: SELECTED_ORDER, payload }),
    selectPickup: (payload) =>
        dispatch({ type: SELECT_PICKUP, payload }),
});

class SelectedPickupPoint extends Component {
    mouseEnter = (order) => {
        this.props.passHoverPoint(order)
    }

    mouseLeave = () => {
        this.props.passHoverPoint({})
    }

    handleClose = () => {
        this.props.selectOrder([])
        this.props.selectPickup({})
    }

    render(){
        const { selectedOrders } = this.props;
        // console.log("seke", selectedOrders)
        return(
        <div className={`started-point-sec ${selectedOrders.length !== 0?'show':''}`}>
            <div style={{position:'absolute',top:"5px",right:"20px", cursor:"pointer"}} onClick={this.handleClose}><img src={Close} height="10px" width="10px" alt="close" /></div>
          <div className="inner-started-point-sec">            
              <div className="total-order-sec">
                  <div className="total-order-head">
                      <p>Total Order From</p>
                        <h3>{selectedOrders.length!==0?selectedOrders[0].warehouse:''}</h3>
                  </div>
                  {/* <!-- ends total-order-head --> */}
                  <div className="total-order-body">
                      { selectedOrders.length!==0? selectedOrders.map( (order, Key) =>
                            <div className="total-body-item" style={{cursor:"pointer"}} key={Key} onMouseEnter={this.mouseEnter.bind(this,order)} onMouseLeave={this.mouseLeave}>
                                <span className="ttl-bdy-img"><img src={KFC} className="kfc" alt="kfc"/></span>
                                <div style={{display:"flex", flexWrap:"wrap"}}>
                                    <h4>{order.customer_name || 'N/A'}</h4>
                                    <div className="order-time">
                                        ({order.order_number})
                                    </div>
                                </div>
                            </div>
                        ):'' }
                  </div>
                  {/* <!-- ends total-order-body --> */}
              </div>
              {/* <!-- ends total-order-sec--> */}

              <div className="all-vans-sec">
                  <div className="inner-vans-sec">
                      {/* <div className="vans-block">
                          <h4>Suggested Van</h4>
                          <div className="vans-dtl-block">
                              <div className="vans-block-item">
                                  <span className="spn-vans-dot"></span>
                                  <div className="vans-num-dtl">
                                      <h5>Van Number One</h5>
                                      <p><span>32Km</span>14 Task</p>
                                  </div>
                                  <button type="button" className="btn btn-point"></button>
                              </div>
                          </div>
                      </div> */}

                      {/* <div className="vans-block">
                          <h4>Available Van</h4>
                          <div className="vans-dtl-block">
                              {vanList.length!==0?vanList.map((van, Key)=>
                                    <div className="vans-block-item" key={Key}>
                                        <span className="spn-vans-dot"></span>
                                        <div className="vans-num-dtl">
                                            <h5>{van.name}</h5>
                                            <p><span>32Km</span>14 Task</p>
                                        </div>
                                        <button type="button" className="btn btn-point"></button>
                                    </div>
                                ):''}
                          </div>
                      </div> */}
                  </div>
                  {/* <!-- ends inner-vans-sec --> */}
                  {/* <button className="a-all">See All Van List</button> */}
              </div>

              {/* <div className="btm-save-btn"><button type="button" className="btn btn-wide-txt btn-av-van w-100 active">Save Changes</button></div> */}

          </div>
          {/* <!-- ends inner-started-point-sec --> */}
      </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SelectedPickupPoint);