/*
  This file contains the EventDisplay component! This is the Card each event has to display its info. If you need to interact with what's being shown about each event, this is where you go.
*/

"use strict";

import React from 'react';
//Required for Material-UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyTheme from '../theme/theme.js';
//Material-UI components used within this form
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import * as Colors from 'material-ui/styles/colors';
//Our files
import Loading from './loading.jsx'
//Services
import { findUser } from '../services/userServices.js'
import { addPerson, removePerson, deleteEvent } from '../services/eventServices.js'

const calendar = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "June",
  6: "July",
  7: "Aug",
  8: "Sept",
  9: "Oct",
  10: "Nov",
  11: "Dec"
}

//Holds links to respective pictures depending on what category was chosen
const eventPics = {
  Trails: "/assets/trails.jpg",
  Beach: "/assets/beach.jpg",
  Park: "/assets/park.jpg",
  'Dog Park': "/assets/dogpark.jpg",
  Something: "/assets/friends.png"
}

class EventDisplay extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      attendees: [],
      eventId: this.props.event._id,
      open: false,
      joined: false,
      message: "Joined event successfully"
    };

    this.join = this.join.bind(this);
    this.unjoin = this.unjoin.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleEventButtonClick = this.handleEventButtonClick.bind(this);
  }

  componentWillMount() {
    let self = this;
    //Gets access to some of the event creator's info
    findUser(this.props.event.creator)
    .then(user => {
      let name = user.firstname + ' ' + user.lastname;
      this.setState({creator: name, creatorDog: user.dogname, pic: user.profilepic});
    });
    let attendees = this.state.attendees;
    this.props.event.attendees.forEach(attendee => {
      //Show that the user has joined an event already if within the attendees array
      if (attendee === this.props.userInfo._id) {
        self.setState({joined: true})
      }
      findUser(attendee)
      .then(person => {
        let people = attendees;
        people.push('\n' + person.firstname);
        this.setState({attendees: people});
      });
    });
    //this.state.eventPic holds link to current event's category picture
    this.setState({eventPic: eventPics[this.props.event.category]});
  }

  join() {
    //When a user wants to join an event, add them to the list of attendees
    let eventId = this.state.eventId;
    addPerson(eventId);
    let attendees = this.state.attendees;
    attendees.push(this.props.userInfo.firstname);
    this.setState({
      attendees: attendees,
      joined: true,
      message: "Joined event successfully",
      open: true
    });
  }

  unjoin() {
    //When a user wants to leave an event, take them out of the list of attendees
    const self = this;
    let attendees = this.state.attendees;
    let index = attendees.indexOf(this.props.userInfo.firstname);
    attendees.splice(index, 1);
    removePerson(this.state.eventId)
    .then(updatedEvent => {
      self.setState({
        attendees: attendees,
        joined: false,
        message: "Left event successfully",
        open: true
      });
    });
  }

  getTitle() {
    //Changes text on button according to whether you're the creator/part of the event
    if (this.props.event.creator === this.props.userInfo._id) {
      return 'Cancel Event';
    }
    return this.state.joined ? 'Leave' : 'Join';
  }

  handleEventButtonClick() {
    let self = this;
    if (this.props.event.creator === this.props.userInfo._id) {
      deleteEvent(this.props.event._id)
      .then(deletedEvent => {
        self.setState({
          joined: false,
          message: `Canceled event ${self.props.event.eventname}`,
          open: true
        });
      });
    } else {
      return this.state.joined ? this.unjoin() : this.join();
    }
  }

  handleRequestClose() {
    this.setState({open: false});
  }

  render () {
    const date = new Date(this.props.event.date);
    const time = this.props.event.time.split(':');
    const hours = time[0] > 12 ? time[0] - 12 : time[0];
    const min = time[1];
    const ampm = time[0] >=12 ? 'PM' : 'AM';
    const zone = this.props.event.time.slice(-5);

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(MyTheme)}>
        <Card>
          <CardHeader
            title={this.props.event.eventname}
            subtitle={'At: ' + this.props.event.loc}
            avatar={this.state.pic}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardMedia>
            <img src={this.state.eventPic} />
          </CardMedia>
          <CardText expandable={true}>
            <strong>Creator:</strong> {this.state.creator}<br />
            <strong>Who's going:</strong> {this.state.attendees.map((person, i) => {
              if (i !== this.state.attendees.length - 1) {
                person += ', ';
              }
              return person;
              })}<br />
            <strong>When:</strong> {calendar[date.getMonth()]} {date.getDate()} at {hours}:{min} {ampm} {zone}
          </CardText>
          <CardActions>
            <FlatButton
              label={this.getTitle()}
              onClick={this.handleEventButtonClick}
            />
            <Snackbar
              bodyStyle={{background: Colors.blueGrey600}}
              open={this.state.open}
              message={this.state.message}
              autoHideDuration={3000}
              onRequestClose={this.handleRequestClose}
            />
          </CardActions>
        </Card>
      </MuiThemeProvider>
    )
  }
}

module.exports = EventDisplay;