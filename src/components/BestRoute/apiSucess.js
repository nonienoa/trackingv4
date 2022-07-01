import React from 'react';
import { SUCCESS_MESSAGE } from '../../constants/actionTypes';
import { connect } from 'react-redux';
import Success from '../../assets/images/icons/icon-success.svg';
import Error from '../../assets/images/icons/icon-error.svg';

const mapDispatchToProps = dispatch => ({
    passSuccess:(payload) => 
        dispatch({ type: SUCCESS_MESSAGE, payload })
})

const mapStateToProps = state => ({
    ...state.bestRoute
})

class APISuccess extends React.Component {
    constructor() {
        super();
        this.state = {
            response: ''
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.response !== prevProps.response) {
            if(this.props.response!=='') {
                window.setTimeout(()=>{
                    this.props.passSuccess('')
                },1500)
            }
        }
    }

    render(){
        return(
            <>
            <div className={`success-msg-block ${this.props.response==="success"?'show':''}`}>
                <button type="button" className="btn btn-close">&#10005;</button>
                <span className="msg-img"><img src={Success} alt="success"/></span>
                <div className="msg-dtl">
                    <h2>Success !</h2>
                    <p>Your Changes has updated Successfully.</p>
                </div>
            </div>

            <div className={`success-msg-block ${this.props.response==="error"?'show':''}`}>
                <button type="button" className="btn btn-close">&#10005;</button>
                <span className="msg-img"><img src={Error} alt="success"/></span>
                <div className="msg-dtl">
                    <h2>Error !</h2>
                    <p>Your Changes has not updated.</p>
                </div>
            </div>

            <div className={`success-msg-block ${this.props.response==="No Data Found"?'show':''}`}>
                <button type="button" className="btn btn-close">&#10005;</button>
                <span className="msg-img"><img src={Error} alt="success"/></span>
                <div className="msg-dtl">
                    <h2>Error !</h2>
                    <p>No Data Found!</p>
                </div>
            </div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(APISuccess)