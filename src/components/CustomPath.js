import { array, object } from "prop-types";
import { withLeaflet } from 'react-leaflet';
import { Path } from "react-leaflet";
import { antPath } from "leaflet-ant-path";

class CustomPath extends Path {
  static defaultProps = {};

  static propTypes = {
    positions: array.isRequired,
    options: object
  };

  createLeafletElement(props) {
    const { positions, options } = props;
    const path = antPath(positions, options);
    const newAnthPath = path.map(pos =>  pos.reverse());

    return newAnthPath;
  }

  updateLeafletElement(fromProps, toProps) {
    if (toProps.positions !== fromProps.positions) {
      this.leafletElement.setLatLngs(toProps.positions);
    }
    this.leafletElement.setStyle({ ...fromProps.options, ...toProps.options });
  }
};

export default withLeaflet(CustomPath)