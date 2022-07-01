import React, {Component} from 'react';
import { connect } from 'react-redux';
import { find } from 'lodash';
import moment from 'moment';
import agent from '../../agent';
import "react-sweet-progress/lib/style.css";

class Status extends Component{
    constructor() {
        super();
        this.state = {
            totalNumber: 0,
            delivering: 0,
            delivered: 0,
            cancelled: 0
        }
    }

    componentDidMount() {
       this.calculateNumber()
    }

    
    componentDidUpdate(prevProps) {
        if(this.props.selectedDriver !== prevProps.selectedDriver) {
            this.calculateNumber()
            
        }
        if(this.props.selectedDayField !== prevProps.selectedDayField){
            this.calculateNumber()
        }
    }
    
    async calculateNumber() {
        let vanList = await agent.BestRoute.vanListByDate(moment(this.props.selectedDayField).format("YYYY-MM-DD"))
        let selectedVan = find(vanList.data, ["name", this.props.selectedDriver.firstName]);
        let totalNumber = selectedVan? selectedVan.total_assigned_vehicle : 0;
        let delivering =  selectedVan? selectedVan.total_delivering_order : 0;
        let delivered =  selectedVan? selectedVan.total_delivered_order : 0;
        this.setState({
            totalNumber,
            delivering,
            delivered,
        })  
    }
    render(){
        const {
            totalNumber,
            delivering,
            delivered,
            cancelled
        } = this.state;
        return(
            <div className="statistics__wrapper">
                <div className="statistics__wrapper-header">
                    <div className="header__left">
                        <p className="mb-0 statistic__title">
                            Statistics
                        </p>   
                        {/* <p className="mb-0 statistic__time">Last order: Assigned at <span className="assign__time">3:15pm</span></p> */}
                    </div>
                    {
                        this.props.permissions.includes('KMs')?
                            <div className="header__right">
                                <p className="mb-0 distance__traveled"><span className="distance">N/A</span>km</p>
                                <p className="mb-0 travelled-txt">Travelled</p>
                            </div>
                        :''
                    }
                </div>
                <div className="statistics__wrapper-contents">
                    <div className="blocks">
                        <p className="mb-0 value value__assigned">{totalNumber}</p>
                        <p className="mb-0 txt">Assigned</p>
                    </div>
                    <div className="blocks">
                        <p className="mb-0 value value__delivering">{delivering}</p>
                        <p className="mb-0 txt">Delivering</p>
                    </div>
                    <div className="blocks">
                        <p className="mb-0 value value__delivered">{delivered}</p>
                        <p className="mb-0 txt">Delivered</p>
                    </div>
                    <div className="blocks">
                        <p className="mb-0 value value__canceled">{cancelled}</p>
                        <p className="mb-0 txt">Cancelled</p>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    deliveries: state.common.deliveries,
    selectedDayField: state.info.selectedDayField,
    selectedDriver: state.info.selectedDriver,
    ...state.common
})

export default connect(mapStateToProps,{})(Status);