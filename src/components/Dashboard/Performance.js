import React, {Component} from 'react';
import LocationIcon from '../../assets/images/location.svg';
import {find} from 'lodash';

class Filter extends Component {
  render() {
    const {selectedWarehouse} = this.props;
    return (
      <div className="deliverd-list">
        <h3>Warehouse</h3>
        <ul>
          {this.props.stationList.length!==0?
            this.props.stationList.map((d, index) => {
              return (
                <li key={index} onClick={this.props.onWarehouseClick.bind(this,d)}>
                  <p className="pointer-user">{d===selectedWarehouse?<strong>{d.name}</strong>:d.name}</p>
                  <div className="place_distance">
                      <span> <img src={LocationIcon} alt="location" />
                        {d===selectedWarehouse?<strong>{this.props.orderNumbers(d, this.props.filterDelivery)} orders</strong>:`${this.props.orderNumbers(d, this.props.filterDelivery)} orders`}
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
  
export default Filter; 