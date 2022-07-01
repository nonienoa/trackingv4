import React, {Component} from 'react';
import LocationIcon from '../../assets/images/location.svg';
import {find} from 'lodash';

class VanList extends Component {
  render() {
    const {selectedVan} = this.props;
    return (
      <div className="deliverd-list">
        <h3>Vehicle</h3>
        <ul>
          {this.props.vanList.length!==0?
            this.props.vanList.map((d, index) => {
              return (
                <li key={index} onClick={this.props.onDriverClick.bind(this,d)}>
                  <p className="pointer-user">{d===selectedVan?<strong>{d.name}</strong>:d.name}</p>
                  <div className="place_distance">
                      <span> <img src={LocationIcon} alt="location" />
                        {d===selectedVan?<strong>{this.props.orderNumbers(d, this.props.filterDelivery)} orders</strong>:`${this.props.orderNumbers(d, this.props.filterDelivery)} orders`}
                      </span>
                  {/* <span> {d.dt} </span>  */}
                 </div>
                </li>
              )
            })
          :''}
        </ul>
      </div>
    )
  }
}
  
export default VanList; 