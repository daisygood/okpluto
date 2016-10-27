'use strict';

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/okplutodb');

var db = mongoose.connection;

db.on('error', function(err) {
	console.log('Rut roh: ', err);
});

db.once('open', function() {
	console.log('Bark bark! Db is working!');
});

module.exports = db;