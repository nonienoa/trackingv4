import React, {Component} from 'react';
import {Bar as BarChart} from 'react-chartjs-2';
import { filter, sumBy} from 'lodash';

class RoadChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartOptions: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          text: 'Average Time Delivery'
        },
        scales: {
          yAxes: [{
            id: 'right-y-axis',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'MINUTES '
            }
          }],
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time (O’clock) '
            }
          }],
        }
      },
      chartData: {
        labels: ["1", "2", "3", "4", "5", "6", "7" ,"8" ,"9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"],
        datasets: [{
          type: 'line',
          label: 'Time Spent',
          backgroundColor: "rgba(255, 255, 255, 0)",
          borderColor: '#00CFB4',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 95, 88, 41, 45, 75, 21, 29, 60, 90, 0, 0, 0, 0, 0],
          yAxisID: 'right-y-axis',
        },
        ]
      }
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props !== prevProps) {
      let { charts } = this.props
      let chartData = this.state.chartData;
      let timeSpent = [];
  
      charts = charts.map(e => {
        e['hour'] = Number(e['hour'])
        return e;
      })
      for (let i=1; i<=24; i++) {
        let matchValue = filter(charts, ['hour', i]);
  
  
        if (matchValue.length === 0) {
          timeSpent.push(0);
        } else {
         
          timeSpent.push(sumBy(matchValue, function(o) {return Number(o.time_spent); }))
        }
  
        // distance.push(sumBy(matchValue, function(o) { return Number(o.dst); }));
  
      }
  
      chartData['datasets'][0]['data'] =  timeSpent;
  
      this.setState({chartData})
    }

  }

  componentDidMount() {
    let chartData = this.state.chartData;
    let timeSpent = [];
    let charts = this.props.charts;

    charts = charts.map(e => {
      e['hour'] = Number(e['hour'])
      return e;
    })
    for (let i=1; i<=24; i++) {
      let matchValue = filter(charts, ['hour', i]);


      if (matchValue.length === 0) {
        timeSpent.push(0);
      } else {
        timeSpent.push(sumBy(matchValue, function(o) {  return Number(o.time_spent); }))
      }

      // distance.push(sumBy(matchValue, function(o) { return Number(o.dst); }));

    }

    chartData['datasets'][0]['data'] =  timeSpent;

    this.setState({chartData})

  }

  render() {
    return (
      <div className="chart-section-title">
        <h3>Average On Road Time</h3>
        <div className="delivery-chart-av">
        <BarChart data={this.state.chartData} options={this.state.chartOptions} height={500} />
        </div>
      </div>
    )
  }
}

export default RoadChart;