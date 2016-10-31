"use strict";

// Database schema for meetups

var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  eventname: String,
  creator: String,
  category: String,
  loc: String,
  lat: Number,
  lng: Number,
  date: Date,
  time: String,
  attendees: [String]
});

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;