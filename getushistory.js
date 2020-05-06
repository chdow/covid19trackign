'use strict';


var Covidtracking = require('./covidtracking.js');

var covidtracking = new Covidtracking();

function fatalError(err) {
  console.error(err);
  process.exit(-1);
}

// stateData is a hash of states where each value is an array of objects for date-based data
var stateData = {};

var dates = {};  // truth hash of dates found

var results = [];

module.exports = function () {

  return covidtracking.statesHistorical().
  then(function (data) {
    data.forEach(obj => {
      if (!stateData[obj.state]) {
        stateData[obj.state] = {};
      }
      stateData[obj.state][obj.date] = obj;
      dates[obj.date] = true;
    });

    var dateArray = Object.keys(dates);
    dateArray.sort(function (a,b) {
      return a -b;
    });

    results[0] = ['Date'].concat(dateArray);

    Object.keys(stateData).forEach(function(state) {
      var stateDates = stateData[state];
      var data = [];

      dateArray.forEach(function(day) {
        var dayData = stateDates[day];
        if (!dayData) {
          data.push(0);
        } else {
          data.push(dayData['positive'] ? dayData['positive'] : 0);
        }
      });
      
      results.push([state].concat(data));

    });
    return results;
  });
}