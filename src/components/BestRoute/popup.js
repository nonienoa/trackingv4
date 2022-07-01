import React from 'react';
import Analysis from '../../assets/images/icons/icon-analysis-white.svg';

class Popup extends React.Component {
    constructor() {
        super();
        this.state = {
            popup: true
        }
    }

    closePopup = () => {
        this.setState({
            popup: false
        })
    }

    render() {
        const { popup } = this.state;
        return(
            <div className="whole-page-popup" style={{ display: `${popup?'':'none'}` }}>
            <div className="popup-sec">
                <div className="popup-analysis">
                    <button type="button" className="btn btn-anyl" onClick={this.closePopup}><img src={Analysis} alt="analysis" />Analysis</button>
                    <p>Start Analyzing and planning, All the Delivery Today</p>
                </div>
            </div>
        </div>
        )
    }
}

export default Popup