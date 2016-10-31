/*
  This file contains the Users schema! Pretty self-explanatory.
*/

"use strict";

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: { type: String, index: { unique: true }},
  id: {type: String, required: true, index: { unique: true }},
  firstname: String,
  lastname: String,
  profilepic: String,
  loc: String,
  lat: Number,
  lng: Number,
  picLink: String,
  dogname: String,
  dogLikes: [String],
  dogBreed: String,
  dogAge: Number,
  events: [String]
});

var User = mongoose.model('User', userSchema);

module.exports = User;