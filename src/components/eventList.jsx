"use strict";

// Divides events into rows of 4 for the
// events page and rows of 3 for the profile
// page, and passes event info to EventDisplay

var React = require('react');
var EventDisplay = require('./eventDisplay.jsx')
import Loading from './loading.jsx'

const Row = (props) => (
  <div className="row">
    {
      props.row.map((event) => (
        <div className={props.class}>
          <EventDisplay event={event} type='user' userInfo={props.userInfo}/>
        </div>
      ))
    }
  </div>
)

class EventList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var rowLength = 4;
    var className = "col-md-3 text-center";
    if (this.props.type === "profile") {
      rowLength = 3;
      className = "col-md-4 text-center"
    }
    if (this.props.events.length) {
      var events = this.props.events
      var rows = [];
      var row = [];
      for (var i = 0; i < events.length; i++) {
        if (i % rowLength === 0 && row.length > 0) {
          rows.push(row);
          row = [];
        }
        row.push(events[i]);
        if (i === events.length - 1 && row.length > 0) {
          rows.push(row);
        }
      }
      return (
        <div className = "container userList">
          {
            rows.map(row => (
              <Row row={row} userInfo={this.props.userInfo} class={className}/>
            ))
          }
      </div>
      )
    } else if (this.props.noEvents) {
      return (
        <h3 className="middle">No Events to Show</h3>
      )
    } else {
      return (
        <Loading />
      )
    }
  }
}

module.exports = EventList;
