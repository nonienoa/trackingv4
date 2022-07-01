import {render} from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { store} from './store';
import './assets/css/style.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './components/App';
import RefreshflatPermissions from './components/RefreshflatPermissions';

render((
  <Provider store={store}>
      <Router>
      <Router>
      <Switch>
      <RefreshflatPermissions>
        <Route path="/" component={App} />
      </RefreshflatPermissions>
      </Switch>
      </Router>

      </Router>
  </Provider>

), document.getElementById('root'));  