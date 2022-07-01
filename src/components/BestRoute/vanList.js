import React from 'react';
// import Loader from '../../assets/loader';
// import Shift from '../../assets/images/icons/icon-shift.svg';

class VanList extends React.Component{
    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        const { activeTab, vanList } = this.props 
        return(
            <>
                <div className="van-list-sec" style={{display: `${activeTab === 'vanList'?'flex':'none'}`}}>
                    <div className="van-numb-sec">
                        { vanList.length!==0?vanList.map((van,Key)=>
                            <VanItem van={van} key={Key} />
                        ):'' }
                    </div> 
                </div>
            </>
        )
    }
}

export default VanList

export class VanItem extends React.Component{
    constructor() {
        super();
        this.state = {
            showRoute: false,
        }
    }

    toggleRoute = () => {
        this.setState({
            showRoute: !this.state.showRoute
        })
    }

    render() {
        const { van } = this.props;
        const { showRoute } = this.state;
        return(
            <div className="van-numb-item" onClick={this.toggleRoute}>
                <div className="van-item-upper">
                    <span className="spn-van-dot dots-blue"></span>
                    <div className="item-upper-dec">
                        <h3>{van.name}</h3>
                        <div className="r-s-div" style={{display: `${showRoute?"none":'flex'}`}}>
                            <span className="spn-rt-num">{van.route.length} Route</span>
                            {/* <span className="spn-sh-tm"><img src={Shift} alt="shift" />Evening Shift</span> */}
                        </div>
                    </div>
                </div>
                <div className="van-item-lower" style={{display: `${showRoute?"block":'none'}`}}>
                    {van.route.length!==0?
                        van.route.map((r, Key) =>  
                        <div className="item-lw-list" key={Key}>
                            <span className="spn-lw-list-num">{Key+1}</span>
                            <div className="lw-list-title">
                                <h4>{r.name}</h4>
                                <div className="lw-tim-sht">
                                    <span className="spn-tsk-num">{r.total_delivery} Task</span>
                                    {/* <span className="spn-list-sh"><img src={Shift} alt="shift" />Early Morning Shift</span> */}
                                </div>
                            </div>
                        </div>
                        )
                    :''}
                </div>
            </div>
  
        )
    }
}