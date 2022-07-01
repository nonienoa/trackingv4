import React from 'react';
import { history } from '../libs/history';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import { LOAD_PERMISSION } from '../constants/actionTypes';
import {connect} from 'react-redux';

const superagent = superagentPromise(_superagent, global.Promise);

const mapDispatchToProps = dispatch => ({
    passPermission: (payload) =>
      dispatch({ type: LOAD_PERMISSION, payload })
})

const CMSHeader = req => {
    let token = '';
    if (window.localStorage.getItem('authToken')) {
      token = window.localStorage.getItem('authToken');
    }
    req.set('Authorization', token)
  }

const RefreshflatPermissions = (props) => {
  if (window.localStorage.getItem('authToken')) {
    superagent.post(`https://tracking-cmsapi.chotobato.com/v1/auth/feUser-by-token`, {token: window.localStorage.getItem('authToken') }).use(CMSHeader)
        .then(res => res.body)
        .then(res=> props.passPermission(res.data.flatPermissions))
        .catch(err =>{
            window.localStorage.removeItem('authToken')
            window.localStorage.setItem('isLoggedIn',false)
            history.push('/login')
        })
  } else {
    window.localStorage.setItem('isLoggedIn',false)
    history.push('/login')
  }

  return <>{props.children}</>;
};

export default connect(null, mapDispatchToProps)(RefreshflatPermissions)