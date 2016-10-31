"use strict";

import Promise from 'bluebird'

// ajax call to get distance btwn two locations
const getDistance = function(origin, destination) {

  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/distance',
      type: 'POST',
      data: {origin: JSON.stringify(origin), destinations: JSON.stringify(destination)},
      success: resolve,
      error: reject
    });
  });
}

module.exports = {
  getDistance: getDistance
}