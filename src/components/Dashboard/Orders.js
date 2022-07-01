import React, {Component} from 'react';
import { Link } from 'react-router-dom'; 
import PickupIcon from '../../assets/images/pickup.svg';
import LocationIcon from '../../assets/images/location.svg';
import { isEmpty } from 'lodash';

class Orders extends Component {
  render() {
    return (
      <div className="lists-sections">
        <h3>
          <img src={PickupIcon} alt="pickup"/>Warehouse Orders
        </h3>
        <ul className="spent-list">
          {
            this.props.delivery && this.props.delivery.length !== 0 ? this.props.delivery.map((d, index) => {
              return (
                <li key={index} style={{ cursor: 'pointer' }} onClick={()=>this.props.handleOrderClick(d)}>
                  {d===this.props.selectedOrder?
                    <strong>
                      <img src={LocationIcon} alt="location"/>{ d.order_number ? d.order_number:"N/A"}
                      {/* <Link to='/'>See Map</Link> */}
                      &nbsp;&nbsp;({d.assign_vehicle?d.assign_vehicle: 'N/A'})
                    </strong>
                    :
                    <>
                      <img src={LocationIcon} alt="location"/>{ d.order_number ? d.order_number:"N/A"}
                      {/* <Link to='/'>See Map</Link> */}
                      &nbsp;&nbsp;({d.assign_vehicle?d.assign_vehicle: 'N/A'})
                    </>
                  }
                </li>
              )
            }):''
          }

        </ul> 
      </div>
    )
  }
}
  
export default Orders; 