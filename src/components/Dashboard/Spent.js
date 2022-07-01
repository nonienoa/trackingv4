import React, {Component} from 'react';
// import { Link } from 'react-router-dom'; 
import PickupIcon from '../../assets/images/pickup.svg';
import LocationIcon from '../../assets/images/location.svg';

class Filter extends Component {
  render() {
    return (
      <div className="lists-sections">
        <h3>
          <img src={PickupIcon} alt="pickup"/> Most Time Spent Area
        </h3>
        <ul className="spent-list">
          {
            this.props.mtsb && this.props.mtsb.length !== 0 ? this.props.mtsb.map((d, index) => {
              return (
                <li key={index}>
                  <img src={LocationIcon} alt="location"/>{ d.b_name !=="" ? d.b_name:"N/A"}
                  {/* <Link to='/'>See Map</Link> */}
                </li>
              )
            }):''
          }

        </ul> 
      </div>
    )
  }
}
  
export default Filter; 