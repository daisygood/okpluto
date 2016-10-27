"use strict";

var User = require('../models/users');
var Event = require('../models/events');
var request = require('request');
var authPath = process.env.AUTH0_DOMAIN;
var api = process.env.GOOGLE_API;
var Promise = require('bluebird');
const googleMaps = require('@google/maps').createClient({
	key: api
});

module.exports = function(app) {

	//======Location End Points=======//

	//Find Latitude and Longitude of an address / location
	app.get('/api/geocode', (req, res) => {
    var getCoordinates = function(address) {
    	return new Promise(function(resolve, reject) {
    		googleMaps.geocode({ address: address }, function(err, res) {
    			if (err) reject(err);
    			resolve(res.json.results[0].geometry.location);
    		});
    	});
    };

    getCoordinates(req.query.loc)
      .then(function(results) {
      	res.status(200).send(results);
      });
	});

	//Find distance btwn coordinates
	app.post('/api/distance', (req, res) => {
		console.log(req.body)
		var getDistance = function(originCoor, destCoors) {
			return new Promise((resolve, reject) => {
				googleMaps.distanceMatrix({
					origins: originCoor,
					destinations: destCoors
				}, (err, res) => {
					if (err) reject(err);
					resolve(res)
				})
			})
		}

		getDistance(JSON.parse(req.body.origin), JSON.parse(req.body.destinations))
		.then(results => {
			console.log(results.json.rows[0].elements)
			res.status(200).send(results.json.rows[0].elements)
		})
	})

	//======User End Points=======//

	app.get('/query/dbId', (req, res) => {
		User.findById(req.query.dbId)
		.exec((err, user) => {
			if (err) console.log(err);
			res.status(201).send(user)
		});
	});

	app.get('/api/users', (req, res) => {
		User.find()
		.exec((err, users) => {
			if (err) {
				console.log(err);
				res.status(404).send("Database error, no users found")
			}
			//console.log(users)
			res.status(201).send({users: users});
		});
	});

	app.post('/signin', (req, res) => {
		//Auth0 user ID
		var id = req.body.id;
		//POST path to retrieve user info from Auth0
		console.log(process.env.AUTH0_DOMAIN);
		var url = 'https://' + process.env.AUTH0_DOMAIN + '/tokeninfo';
		request.post(url, { json: {id_token: id} } , (err, response) => {
			console.log(response.body);
			if (err) console.log(err)
			//Look for user in mongoDB
			User.findOne({
				'id': response.body.user_id
			}).exec((err, user) => {
				//Add user if they don't exist
				if (!user) {
					//get user info supplied through login / signup from FB, Google and Auth0
					var userData = response.body;
					//For signups through Auth0 collect metadata
					if (userData.user_metadata) {
						for (var key in userData.user_metadata) {
							userData[key] = userData.user_metadata[key];
						}
					}
					if (userData.picture_large) {
						userData.picture = userData.picture_large;
					}
					//Create user in mongoDB
					new User ({
						id: userData.user_id,
						firstname: userData.given_name,
						lastname: userData.family_name,
						profilepic: userData.picture,
						username: 'anonymous' + Math.floor(Math.random()*100000000)
					}).save((err, user) => {
						if (err) console.log(err)
						res.status(200).send({user: user, creation: true})
					})
				} else {
					user.creation = false;
					res.status(200).send({user: user, creation: false})
				}
			})
		})
	});

	app.put('/api/users', (req, res) => {
		User.findById(req.body.dbId, (err, user) => {
			for (var key in req.body) {
				if (key !== 'dbId') {
					user[key] = req.body[key];
				}
			}
			user.save((err, updatedUser) => {
				res.status(200).send(updatedUser)
			})
		})
	});

	app.delete('/api/users', (req, res) => {
		User.findByIdAndRemove(req.body.dbId)
		.exec((user) => {
			res.status(200).send(userRemoved)
		})
	});

	//======Event End Points=======//
	app.get('/api/events', (req, res) => {
		Event.find()
		.exec((err, events) => {
			if (err) {
				console.log(err);
				res.status(404).send("Database error, no events found")
			}
			res.status(201).send({events: events});
		});
	});

	app.post('/api/events', (req, res) => {
		req.body = JSON.parse(req.body.data);
		new Event ({
			creator: req.body.creator,
			eventname: req.body.eventname,
			category: req.body.category,
			loc: req.body.loc,
			lat: req.body.lat,
			lng: req.body.lng,
			date: req.body.date,
			time: req.body.time,
			attendees: req.body.attendees
		}).save((err, event) => {
			if (err) throw err
			res.status(200).send({event: event})
		});
	})

	app.put('/api/events/add', (req, res) => {
		console.log(req.body)
		Event.findById(req.body.eventId, (err, event) => {
			let attendees = event.attendees;
			if (attendees.indexOf(req.body.userId) === -1) {
				attendees.push(req.body.userId);
			}
			event.attendees = attendees;
			event.save((err, updatedEvent) => {
				res.status(200).send({updatedEvent: updatedEvent})
			})
		})

	})

	//========Outside APIs Endpoints===========//
	app.get('/api/shareKeys', (req, res) => {
		var dev1 = new RegExp('127.0.0.1', 'g')
		var dev2 = new RegExp('localhost:8080', 'g')
		var prod = new RegExp('okpluto.herokuapp.com', 'g')
		if (req.headers.host.match(dev1) || req.headers.host.match(dev2) || req.headers.host.match(prod)) {
			res.status(200).send({auth: authPath.auth0})
		}
	})
};
