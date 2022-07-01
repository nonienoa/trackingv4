import React, {Component} from 'react';
import PickupIcon from '../../assets/images/pickup.svg';
import LocationIcon from '../../assets/images/location.svg';
import KMSmallIcon from '../../assets/images/km_small.svg';
import agent from '../../agent';
import { } from 'lodash';

class Trip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trips : []
    }
  }



  async componentDidMount() {
    const {tripSelectedUser} = this.props;
    let data = await agent.Dashboard.pathProperties({ org: 'skrfuejheb', device: this.props.selectedDevice, user:tripSelectedUser.user_id, date:tripSelectedUser.dt })
    if (data !== []) {
      if(data.data) {
        if (data.data.length === 1) {
          this.setState({trips: data.data[0].properties})
          this.props.tripsList(data.data[0].properties)
        } else {
          let list = [];
          for (let d of data.data) {
            list.push(...d.properties);
          }
  
          this.setState({trips: list})
          this.props.tripsList(list)
        }
      }
    }
  }

  async componentDidUpdate(prevProps) {
    if(this.props.tripSelectedUser !== prevProps.tripSelectedUser) {
      let data = await agent.Dashboard.pathProperties({ org: 'skrfuejheb', device: this.props.selectedDevice, user:this.props.tripSelectedUser.user_id, date:this.props.tripSelectedUser.dt  })
  
      if (data !== []) {
        if(data.data) {
          if (data.data.length === 1) {
            this.setState({trips: data.data[0].properties})
            this.props.tripsList(data.data[0].properties)
          } else {
            let list = [];
            for (let d of data.data) {
              list.push(...d.properties)
            }
            this.setState({trips: list})
            this.props.tripsList(list)
          }
        }
      }
    }
  }

  render() {
    return (
      <div className="lists-sections">
        <h3>
          <img src={PickupIcon} alt="pickup"/> Trips
        </h3>
        <ul className="trip-list">
          {
            this.state.trips?this.state.trips.map((d, index) => {
                return (
                  <li key={index}>
                    <img src={LocationIcon} alt="location"/>{ d.name ? d.name : 'N/A'}
                    <div className="place_distance">
                    <span> <img src={KMSmallIcon} alt="location" /> {d?(d.length * 0.001).toFixed(2):'N/A'} km</span>
                    </div>
                  </li>
                )
            }):''
          }

        </ul>
      </div>
    )
  }
}

export default Trip;