import React, {Component} from 'react';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import SearchIcon from '../../assets/images/search.svg';
import 'bootstrap-daterangepicker/daterangepicker.css';
import Autosuggest from 'react-autosuggest';
import {map} from 'lodash';


class Filter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      suggestions: [],
      userList:[],
      filterDate: moment().format(),
      startDate: moment(),
      endDate: moment().add(29,'days'),
      range: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        // 'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        // 'This Month': [moment().startOf('month'), moment().endOf('month')],
        // 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
     }
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.deviceList !== prevProps.deviceList) {
      this.setState({
       userList: map(this.props.deviceList, (e) => {
         return {
           name: e.name,
           id: e["imei-number"]
         }
        })
      })
    }
  }

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.state.userList.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  }

  getSuggestionValue = suggestion => suggestion.name

  renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  )

  handleSelect = (ranges) => {
  }

  handleOnApply = (event, a) => {
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  }

  render() {
    const { value, suggestions, range } = this.state;
    const inputProps = {
      placeholder: 'Users',
      value,
      onChange: this.onChange
    };

    return (
      <div className="filter-section">
        <div className="drop-zone">
          <label>Filter</label>
          <DateRangePicker
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          onEvent={this.props.handleEvent}
          onApply={this.handleOnApply}
           ranges={range}
           containerClass="date_ranger_picker">
            <input value={this.props.startDate.format('MM/DD') + ' -> ' +this.props.endDate.format('MM/DD')} onChange={this.onChange}/>
          </DateRangePicker>
        </div>
        <div className="dashsearch-section">
          <div className="dashsearch-input">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            onSuggestionSelected={this.props.userSearch}
            inputProps={inputProps}
          />
          </div>
          <button>
            Search
            <img src={SearchIcon} alt="search"/>
          </button>
        </div>
      </div>
    )
  }
}

export default Filter;