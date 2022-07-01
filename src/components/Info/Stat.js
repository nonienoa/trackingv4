import React, {Component} from 'react';
import {Bar as BarChart} from 'react-chartjs-2';
import agent from '../../agent';
import Cross from '../../assets/images/cross.svg';
import Statistics from '../../assets/images/statistics.svg';
import {filter, sortBy, uniq} from 'lodash';
import moment from 'moment';

class Stat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      chartOptions: {
        maintainAspectRatio: false
      },
      chartData: {
        labels: ["1", "2", "3", "4", "5", "6", "7"],
        datasets: [{
            label: "Time Spent",
            backgroundColor: '#29C0FF',
            borderColor: '#29C0FF',
            data: [1, 10, 5, 2, 20, 30, 50],
        }]
      }
    }
  }

  async componentDidUpdate(prevProps) {
    if(this.props !== prevProps) {
      let { selectedDayField } = this.props;
      let {chartData} = this.state;
      let hours = [];
      let data = await agent.Trips.getChartData(this.props.selectedDriver.deviceId, moment(selectedDayField).format('YYYY-MM-DD'), moment(selectedDayField).format('YYYY-MM-DD'));
  
      let timeSpent = [];
      data = data.map(e => {
        e['hour'] = Number(e['hour']);
  
        if (hours.indexOf(Number(e['hour'])) === -1) {
          hours.push(Number(e['hour']))
        }
  
        return e;
      })
      for (let i=1; i<=24; i++) {
        let matchValue = filter(data, ['hour', i]);
  
        if (matchValue.length === 0) {
  
        } else {
          timeSpent.push(Math.floor(Number(matchValue[0]['time_spent'])))
        }
      }
  
      hours = uniq(hours);
      hours = sortBy(hours);
  
      chartData['datasets'][0]['data'] =  timeSpent;
      chartData['labels'] =  hours;
      this.setState({chartData})
    }
  }


  async componentDidMount() {
    let {chartData} = this.state;
    let hours = [];
    let data = await agent.Trips.getChartData(this.props.selectedDriver.deviceId, moment(this.props.selectedDayField).format('YYYY-MM-DD'),moment(this.props.selectedDayField).format('YYYY-MM-DD'));

    let timeSpent = [];
    data = data.map(e => {
      e['hour'] = Number(e['hour']);

      if (hours.indexOf(Number(e['hour'])) === -1) {
        hours.push(Number(e['hour']))
      }

      return e;
    })
    for (let i=1; i<=24; i++) {
      let matchValue = filter(data, ['hour', i]);

      if (matchValue.length === 0) {

      } else {
        timeSpent.push(Math.floor(Number(matchValue[0]['time_spent'])))
      }
    }

    hours = uniq(hours);
    hours = sortBy(hours);

    chartData['datasets'][0]['data'] =  timeSpent;
    chartData['labels'] =  hours;
    
    this.setState({chartData})

  }

  render() {
    return (
      <div className={`chart-info  popup-list ${this.props.statInfo ? 'chart-colapse' : ''}`}>
        <button className="cross chart-graph" onClick={this.props.toggleStatInfo}>
          <img src={Cross} alt="cross" />
        </button>
        <div className="chart-title">
          <h5><img src={Statistics} alt="statistics"/> Statistics</h5>
          <div className="input-group">
            <div id="radioBtn" className="btn-group">
              {/*<a className="btn btn-sm active" data-toggle="happy" data-title="Y" href="#">Time</a>
              <a className="btn btn-sm notActive" data-toggle="happy" data-title="N"  href="#">Km</a>*/}
            </div>
          </div>
        </div>

        <div className="cart-section">
          <BarChart data={this.state.chartData} options={this.state.chartOptions} width={280} height={200}/>
        </div>
      </div>
    );
  }
}

export default Stat;