import React, {Component} from 'react';
import agent from '../../agent';
import Cross from '../../assets/images/cross.svg';
import Trip from '../../assets/images/trip.svg';
import CrossCircle from '../../assets/images/cross-with_circle.svg';
import Chart from "react-google-charts";
import moment from 'moment';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStateDate: null,
      trips: true,
      location: false,
      locationData: [],
      renderCharts: false,
      googleColumns: [
        { type: 'string', id: 'Room' },
        { type: 'string', id: 'Name' },
        { type: 'date', id: 'Start' },
        { type: 'date', id: 'End' }
      ],
      googleRows: [
        ['Timeline', 'Trip 1', new Date(0, 0, 0, 12, 0, 0), new Date(0, 0, 0, 13, 0, 0)]
      ],
      locationRows: [
        ['Timeline', 'Trip 1', new Date(0, 0, 0, 12, 0, 0), new Date(0, 0, 0, 13, 0, 0)]
      ],
      groupedData: []
    }

    this.selectLocation = this.selectLocation.bind(this)
    this.selectTrip = this.selectTrip.bind(this)
  }

  // handleSelectLocationCallback = ({chartWrapper}) => {
  //   let selectedRow = chartWrapper.getChart().getSelection();
  //   let location  = this.state.locationData[selectedRow[0]['row']];
  //   let pinPoints = [];


  //   const duration =  moment.duration(moment(location['checkout']).diff(moment(location['checkin'])));
  //   pinPoints.push({
  //     cordinates: [location['lat'], location['lng']],
  //     startTime: null,
  //     endTime: null,
  //     name: location['build_name'],
  //     stayIn: moment(location['checkin']).subtract(5, 'hours').subtract(45, 'minutes').format('h:ss a') +' - ' +  moment(location['checkout']).subtract(5, 'hours').subtract(45, 'minutes').format('h:ss a'),
  //     totalTime: duration.humanize()
  //   })

  //   this.props.setGPSPath(null)
  //   this.props.pinPoint(pinPoints)
  // }

  handleSelectCallback = ({ chartWrapper }) => {
    let selectedRow = chartWrapper.getChart().getSelection();
    let sortedData = this.state.groupedData.data[selectedRow[0].row].geojson;
    // let selectedRow = chartWrapper.getChart().getSelection();
    // let sortedDate = this.state.groupedData[selectedRow[0]['row']];
    // let location  = this.state.locationData[selectedRow[0]['row']];
    // let nextLocation  = this.state.locationData[selectedRow[0]['row'] + 1]
    let pinPoints = [];
    if (sortedData) {
      pinPoints.push({
        cordinates: [sortedData.coordinates[0][0][1], sortedData.coordinates[0][0][0]],
        startTime: null,
        endTime: moment(this.state.googleRows[selectedRow[0].row][2]).format('hh:mm a'),
        name: 'N/A',
        totalTime: null
      })
      pinPoints.push({
        cordinates: [sortedData.coordinates[sortedData.coordinates.length - 1][sortedData.coordinates[sortedData.coordinates.length - 1].length - 1][1], sortedData.coordinates[sortedData.coordinates.length - 1][sortedData.coordinates[sortedData.coordinates.length - 1].length - 1][0]],
        startTime: moment(this.state.googleRows[selectedRow[0].row][3]).format('hh:mm a'),
        endTime: null,
        name: 'N/A',
        totalTime: null
      })
    }


    this.props.setGPSPath([])
    this.props.setGPSPath([sortedData])
    this.props.pinPoint(pinPoints)
  }

  // async componentWillReceiveProps({selectedDayField}) {
  //   if (this.state.currentStateDate === selectedDayField) return;
  //   this.setState({renderCharts: false, currentStateDate: selectedDayField})
  //   let data = await agent.Dashboard.tripData({device:'m',user:"583", date:"2020-02-05"});
  //   if(data.length === 0) return;

  //   // this.props.setGPSPath(null)

  //   // this.props.setGPSPath(data.geojson)

  //   let googleRows = [];
  //   let locationRows = [];
  //   let counter = 0;
  //   console.log(data.data)
  //   for (let d of data.data) {
  //     console.log(d)
  //     if (d.trip === 1 && counter === 0) {
  //       googleRows.push([
  //         'Timeline',
  //         `Trip ${counter + 1}`,
  //           new Date(`${d.trip_start_dt.split('T')[0]} ${d.trip_start_dt.split('T')[1].split(':')[0]}:${d.trip_start_dt.split('T')[1].split(':')[1]}:00`),
  //           new Date(`${data.trips[counter + 1]['end_ts'].split('T')[0]} ${data.trips[counter + 1]['end_ts'].split('T')[1].split(':')[0]}:${data.trips[counter + 1]['end_ts'].split('T')[1].split(':')[1]}:00`)
  //         ]);
  //     } else {
  //         googleRows.push([
  //           'Timeline',
  //           `Trip ${counter + 1}`,
  //             new Date(`${d.trip_start_dt.split('T')[0]} ${d.trip_start_dt.split('T')[1].split(':')[0]}:${d.trip_start_dt.split('T')[1].split(':')[1]}:00`),
  //             new Date(`${d.end_ts.split('T')[0]} ${d.end_ts.split('T')[1].split(':')[0]}:${d.end_ts.split('T')[1].split(':')[1]}:00`)
  //           ]);
  //     }


  //     counter++;
  //   }
  //   console.log(googleRows)

  //   // counter = 0;
  //   // for (const d of data.location) {
  //   //     locationRows.push([
  //   //       'Timeline',
  //   //       `Location ${counter + 1}`,
  //   //       new Date(`${d.checkin.split('T')[0]} ${d.checkin.split('T')[1].split(':')[0]}:${d.checkin.split('T')[1].split(':')[1]}:00`),
  //   //       new Date(`${d.checkout.split('T')[0]} ${d.checkout.split('T')[1].split(':')[0]}:${d.checkout.split('T')[1].split(':')[1]}:00`)
  //   //     ]);

  //   //     counter++;

  //   // }

  //   // counter = 1;
  //   // for (const d of data.location) {

  //   //   counter++;
  //   // }

  //   this.setState({
  //     googleRows,
  //     locationRows,
  //     renderCharts: true,
  //     groupedData:data.geojson,
  //     locationData: data.location
  //   })
  // }

  async componentDidMount() {
    // let data = await agent.Dashboard.tripData({device:this.props.selectedDriver.type==="gps"?'g':'m',user:this.props.selectedDriver.type==="gps"?this.props.selectedDriver.deviceId:this.props.selectedDriver.id, date:moment(this.props.selectedDayField).format('YYYY-MM-DD')});
    let data = await agent.Dashboard.tripData({device:this.props.selectedDriver.type==="gps"?'g':'m',user:this.props.selectedDriver.type==="gps"?this.props.selectedDriver.deviceId:this.props.selectedDriver.id, date:moment(this.props.selectedDayField).format('YYYY-MM-DD')});
    let pathData = await agent.Dashboard.pathData({device:this.props.selectedDriver.type==="gps"?'g':'m',user:this.props.selectedDriver.type==="gps"?this.props.selectedDriver.deviceId:this.props.selectedDriver.id, date:moment(this.props.selectedDayField).format('YYYY-MM-DD') , org:'skrfuejheb'})
    if(data.length === 0) return;


    // this.props.setGPSPath(data.geojson)

    let googleRows = [];
    let locationRows = [];

    for (let d of data.data) {
      googleRows.push([
        'Timeline',
        `Trip ${d.trip}`,
          new Date(0,0,0,d.trip_start_dt.split(' ')[1].split(":")[0],d.trip_start_dt.split(' ')[1].split(":")[1],0),
          new Date(0,0,0,d.trip_end_dt.split(' ')[1].split(":")[0],d.trip_end_dt.split(' ')[1].split(":")[1],0)
      ])
    }

  //  counter = 0;
  //   for (const d of data.location) {
  //       locationRows.push([
  //         'Timeline',
  //         `Location ${counter + 1}`,
  //         new Date(`${d.checkin.split('T')[0]} ${d.checkin.split('T')[1].split(':')[0]}:${d.checkin.split('T')[1].split(':')[1]}:00`),
  //         new Date(`${d.checkout.split('T')[0]} ${d.checkout.split('T')[1].split(':')[0]}:${d.checkout.split('T')[1].split(':')[1]}:00`)
  //       ]);

  //       counter++;

  //   }

    this.setState({
      googleRows,
      locationRows,
      renderCharts: true,
      groupedData:pathData,
      locationData: data.location
    })
  }

  async componentDidUpdate(prevProps) {
    if(this.props.selectedDayField !== prevProps.selectedDayField || this.props.selectedDriver !== prevProps.selectedDriver) {
      let data = await agent.Dashboard.tripData({device:this.props.selectedDriver.type==="gps"?'g':'m',user:this.props.selectedDriver.type==="gps"?this.props.selectedDriver.deviceId:this.props.selectedDriver.id, date:moment(this.props.selectedDayField).format('YYYY-MM-DD')});
      let pathData = await agent.Dashboard.pathData({device:this.props.selectedDriver.type==="gps"?'g':'m',user:this.props.selectedDriver.type==="gps"?this.props.selectedDriver.deviceId:this.props.selectedDriver.id, date:moment(this.props.selectedDayField).format('YYYY-MM-DD') , org:'skrfuejheb'})
      if(data === undefined || data === null || data.length === 0) return;


      // this.props.setGPSPath(data.geojson)

      let googleRows = [];
      let locationRows = [];

      for (let d of data.data) {
        googleRows.push([
          'Timeline',
          `Trip ${d.trip}`,
            new Date(0,0,0,d.trip_start_dt.split(' ')[1].split(":")[0],d.trip_start_dt.split(' ')[1].split(":")[1],0),
            new Date(0,0,0,d.trip_end_dt.split(' ')[1].split(":")[0],d.trip_end_dt.split(' ')[1].split(":")[1],0)
        ])
      }

    //  counter = 0;
    //   for (const d of data.location) {
    //       locationRows.push([
    //         'Timeline',
    //         `Location ${counter + 1}`,
    //         new Date(`${d.checkin.split('T')[0]} ${d.checkin.split('T')[1].split(':')[0]}:${d.checkin.split('T')[1].split(':')[1]}:00`),
    //         new Date(`${d.checkout.split('T')[0]} ${d.checkout.split('T')[1].split(':')[0]}:${d.checkout.split('T')[1].split(':')[1]}:00`)
    //       ]);

    //       counter++;

    //   }

      this.setState({
        googleRows,
        locationRows,
        renderCharts: true,
        groupedData:pathData,
        locationData: data.location
      })
      }
  }

  componentWillUnmount () {
    this.props.setGPSPath([])
    this.props.pinPoint([])
  }

  selectTrip = () => {
    this.setState({
      trips: true,
      location: false,
    })
  }

  selectLocation = () => {
    this.setState({
      trips: false,
      location: true,
    })
  }

  render() {
    return (
      <div className={`footer-timeline ${this.props.timelineInfo ? 'footer-timeline-colapse' : ''}`}>
        <div className="bg-white">
          <div className="close-btn">
          <div className={`tabs ${this.state.trips ? 'active' : ''}`} onClick={this.selectTrip}>
            <img className="trip-footer" src={Trip} alt="trip"/>
            Trips
          </div>

          {/* <div className={`tabs ${this.state.location ? 'active' : ''}`} onClick={this.selectLocation}>
            <img className="trip-footer" src={Trip} alt="trip"/>
            Locations
          </div> */}
            <button className="time-line" onClick={this.props.toggleTimelineInfo}>
              <img className="cross-footer" src={CrossCircle} alt="circle"/>
            </button>
          </div>

          <div className="time-line-detail">
            <div className="cross-btn-detail time-laps-detail">
              <img src={Cross} alt="close"/>
            </div>

            <div  style={{ display: 'flex', width: '98%' }}>
            {/* {this.state.renderCharts && this.state.trips && ( */}
              <Chart
              chartType="Timeline"
              data={[this.state.googleColumns, ...this.state.googleRows]}
              width="98%"
              height="500px"
              options={{
                timeline: { colorByRowLabel: true },
                tooltip: { isHtml: true }
              }}
            chartEvents={[{
              eventName: 'select',
              callback: this.handleSelectCallback
            }]}/>
            {/* )} */}
            {/* {this.state.renderCharts && this.state.location && (
              <Chart
              chartType="Timeline"
              data={[this.state.googleColumns, ...this.state.locationRows]}
              width="100%"
              height="550px"
              options={{
                timeline: { colorByRowLabel: true },
                tooltip: { isHtml: true }
              }}
            chartEvents={[{
              eventName: 'select',
              callback: this.handleSelectLocationCallback
            }]}/>
            )} */}
            </div>


          </div>
        </div>
      </div>
    );
  }
}

export default Timeline;