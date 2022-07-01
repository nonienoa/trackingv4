import React, {Component} from 'react';
import {TextField} from '@material-ui/core';
import LoginLogo from '../assets/images/login-logo.svg';
import LoginImage from '../assets/images/login-image.svg';
import { LOGGED_IN, LOAD_PERMISSION } from '../constants/actionTypes';
import { connect } from 'react-redux';
import agent from '../agent';

const mapDispatchToProps = dispatch => ({
  toggleLogin: () =>
    dispatch({ type: LOGGED_IN }),
  passPermission: (payload) =>
    dispatch({ type: LOAD_PERMISSION, payload })
})

const mapStateToProps = state => ({
  isLoggedIn : state.common.isLoggedIn
})

class Login extends Component {

  constructor() {
    super();
    this.state = {
      userName: '',
      password: '',
      isValid: true
    }
  }

  componentDidMount() {
    if(window.localStorage.getItem('isLoggedIn')==="true") {
      this.props.history.push('/home')
    }
  }

  submitLogin = async () => {
    if(this.state.userName !== '' && this.state.password !== '' && 
      this.state.userName !== null && this.state.password !== null) {

      const data = {
                    "username": this.state.userName,
                    "password": this.state.password
                  }

      // if (this.state.userName === "bishwa" && this.state.password ==="bishwa100") {
      //   this.handleResponse("SpecialGrant");
      //   return;
      // }

      // if (this.state.userName === "superadmin" && this.state.password ==="Ch0t0bat0") {
      //   this.handleResponse("SpecialGrant");
      //   return;
      // }
      agent.CMS.login(data)
        .then(res=>this.handleResponse(res))
        .catch(err => {
          this.setState({
            isValid: false
          })
          window.setTimeout(
            () => {
              this.setState({
                isValid: true
              })
            },3000)
        })
      // agent.Drivers.fmAuth(data)
      //   .then(res=> this.handleResponse(res))
        // .catch(err => {
        //   this.setState({
        //     isValid: false
        //   })
        //   window.setTimeout(
        //     () => {
        //       this.setState({
        //         isValid: true
        //       })
        //     },3000)
        // })
    } else {
      this.setState({
        isValid: false
      })
      window.setTimeout(
        () => {
          this.setState({
            isValid: true
          })
        },3000)
    }
  }

  handleResponse = (res) => {
    if(res) {
      window.localStorage.setItem("isLoggedIn", true);
      window.localStorage.setItem("authToken", res.data.authToken)
      this.props.passPermission(res.data.flatPermissions)
      window.setTimeout(
        () => {
          this.props.history.push('/home')
        },1000
      )
    }
    else {
      window.localStorage.setItem("isLoggedIn", false);
      this.setState({
        isValid: false
      })
      window.setTimeout(
        () => {
          this.setState({
            isValid: true
          })
        },3000
    )
  }
}

  handleUserChange = (e) => {
    this.setState({
      userName: e.target.value
    })
  }

  handlePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  render() {
    const {isValid} = this.state;
    return (
      <div className="login__wrapper">
        <div className="form__section">
          <div className="form__section-left">
            <div className={`form__section-left-header ${isValid ? '': 'error__header-height'}`}>
              <div>
                <span className="mini__title">WELCOME TO</span>
                <h4 className="form__section-left-header-title">CHOTO TRACKING</h4>
              </div>
              <div className="login__err">
                <p className="mb-0 login-err-msg">Invalid login</p>
              </div>
            </div>
            <div className="left__main__wrapper">
              <div className="form__section-left-main">
                <form className="login__material-ui" noValidate autoComplete="off">
                  <TextField className="user__input" id="usr-name" label="User Name" onChange={this.handleUserChange}/>
                  <TextField className="password__input" type="password" id="pswrd" onChange={this.handlePassword} label="Password" />
                </form>
              </div>
              <div className="form__section-left-footer">
                <button className="btn login__btn" onClick={this.submitLogin}>Login</button>
              </div>
            </div>
          </div>
          <div className="form__section-right">
            <div className="form__section-right-header">
              <img src={LoginLogo} alt="login-logo" />
              <h4 className="form__section-right-title">Heart of Delivery Business</h4>
            </div>
            <div className="form__section-right-footer">
              <img src={LoginImage} alt="login-images" />
            </div>
          </div>
        </div>
        <div className="login__footer">
          <span className="login__footer-text">© Copyright 2020 EKbana</span>
        </div>
      </div>
    )
    };
  }

export default connect(mapStateToProps, mapDispatchToProps)(Login);
