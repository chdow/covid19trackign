'use strict';

const readline = require('readline');
const fs       = require('fs');


function getStateDataFromFile(input, dataSet) {
  if (!dataSet) {
    dataSet = 'cases';
  }
  return new Promise( (resolve, reject) => {
    var firstLine = false;
    var keys = [];
    var data = [];
    var sortedDates = [];

    if (!input) {
      return reject(new Error('must specify input file'));
    }
    var inputStream = fs.createReadStream(input);

    var rl = readline.createInterface({
      input: inputStream
    });

    // First read the file and get keys/values for every row
    // as of this writing the keys are date, state, fips, cases, and deaths
    rl.on('line', function (line) {
      if (!firstLine) {
        keys = line.split(',');
        firstLine = true;
      } else {
        var obj = {};
        var values = line.split(',');
        for (var i = 0; i < keys.length; i++) {
          obj[keys[i]] = values[i];
        }
        data.push(obj);
      }
    });

    // this is a 'truth hash' where we collect all the dates as keys.  
    // we'll later extract the keys and sort them into a list of dates for which we
    // have data
    var dates = {};

    // this is a hash where the key is the name of the state and the value is a 
    // hash where the keys are the dates and the values are the objects with the
    // data for that date
    var dataHashedByState = {};
    rl.on('close', function () {
      data.forEach(function (o) {
        // if there is no data for the key, create the key and make the value 
        // an empty array
        if (!dataHashedByState[o.state]) {dataHashedByState[o.state] = {};}
        var date = o.date;
        var hash = dataHashedByState[o.state];
        hash[date] = o;
        dates[date] = true;
      });

      sortedDates = Object.keys(dates).sort();
      var rows = [['Date'].concat(sortedDates)];
        Object.keys(dataHashedByState).forEach(function(state) {
          var row = generateRowForState(sortedDates, dataHashedByState[state], dataSet);
          rows.push(row);
        });
      resolve(rows);
    });
  });

}

function generateRowForState(dates, dataHashedByDate, key) {
  var row = [];
  var data  = [];
  // Get the state out of the data 
  // We don't know here what dates for which we have data, so just get 
  // all the keys and use the first one
  var state = dataHashedByDate[Object.keys(dataHashedByDate)[0]].state;

  dates.forEach(function(d) {
    var o = dataHashedByDate[d];
    if (undefined !== o) {
      data.push(+o[key]);
    }  else {
      data.push(0);
    }
  });

  row = [state].concat(data);
  return row;
}

module.exports.getStateDataFromFile = getStateDataFromFile;