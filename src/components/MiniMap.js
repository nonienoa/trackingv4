
import React from 'react';

import Sat from '../assets/images/sat.png';
import Str from '../assets/images/str.png';

class MiniMap extends React.Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
  }

  toggle = () => {
    if (this.props.isStreet) {
      this.props.toggleMap('mapbox://styles/mapbox/satellite-v9')
    } else {
      this.props.toggleMap('mapbox://styles/mapbox/streets-v10')
    }
  }

  render() {
    return (
      <div className={`mini-map ${this.props.drivertab || this.props.locationtab ? '' : 'hide'}`} onClick={this.toggle}>
        {this.props.isStreet ? (
          <img src={Sat} alt=""/>
        ) : (
          <img src={Str} alt=""/>
        )}
        <span>{this.props.isStreet ? 'Satelite' : 'Street'}</span>
      </div>
    );
  }
}

export default MiniMap;