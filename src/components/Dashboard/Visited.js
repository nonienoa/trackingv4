import React, {Component} from 'react';
// import { Link } from 'react-router-dom';
import DropIcon from '../../assets/images/drop.svg';
import LocationIcon from '../../assets/images/location.svg';

class Visited extends Component {
  render() {
    return (
      <div className="lists-sections">
        <h3>
          <img src={DropIcon} alt="drop"/> Most Visited Area
        </h3>
        <ul className="spent-list">
          {
            this.props.mvb && this.props.mvb.length!==0 ? this.props.mvb.map((d, index) => {
              return (
                <li key={index}>
                  <img src={LocationIcon} alt="location" /> {d.b_name !== ""?d.b_name: "N/A"}
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
  
export default Visited; 