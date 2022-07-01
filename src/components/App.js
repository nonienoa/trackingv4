import React from 'react';
import { connect } from 'react-redux';
import { APP_LOAD, DRIVER_LIST } from '../constants/actionTypes';
import { Route, Switch } from 'react-router-dom';
import agent from '../agent';
import Home from './Home';
import Dashboard from './Dashboard';
import Forecast from './Forecast';
import Login from './Login';
import BestRoute from './BestRoute';
import ListView from './ListView';
import 'leaflet/dist/leaflet.css';


const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    ...state.common
  }
};

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
  driverStatistics: (payload) =>
    dispatch({ type: DRIVER_LIST , payload }),
});

class App extends React.Component {
  componentDidMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      // agent.setToken(token);
    }
    this.props.driverStatistics(Promise.all([agent.DriverStats.get()]))
    const dataa = Promise.all([agent.DriverStats.get()])
    console.log("firstaaa", dataa)
    // this.props.onLoad(token ? agent.Auth.current() : null, token);
  }

  render() {
      return (
        <div>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/home" component={Home} />
            {this.props.permissions.includes("Route")?
              <Route exact path="/route" component={BestRoute} />:''
            }
            {this.props.permissions.includes("List View")?
              <Route exact path="/list-view/:id" component={ListView} />
              :''
            }
            {this.props.permissions.includes("Dashboard")?
              <Route exact path="/dashboard" component={Dashboard}/>
              :''
            }
            {this.props.permissions.includes("Forecast")?
              <Route exact path="/forecast" component={Forecast}/>
              :''
            }
          </Switch>
        </div>
      );
  }
}

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(App);