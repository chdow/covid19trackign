'use strict';

const readline = require('readline');
const fs       = require('fs');

function die(err) {
  console.error(err);
  process.exit(-1);
}


function getCountyDataFromFile(input, dataSet) {
  return new Promise((resolve, reject) => {
    if (!input) {
      return reject(new Error('must specify input file'));
    } 

    if (!dataSet) {dataSet = 'cases'};
    var firstLine = false;
    var inputStream = fs.createReadStream(input);
    var keys = [];
    var data = [];
    var dateObj = {};
    var sortedDates = [];
    
    var rl = readline.createInterface({
        input: inputStream
    });
    
    // First read the file and get keys/values for every row
    // as of this writing the keys are date, county, state, fips, cases, and deaths
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
    
    // this is a hash where the key is the name of the county and the value is a 
    // hash where the keys are the dates and the values are the objects with the
    // data for that date
    var dataHashedByCounty = {};
    rl.on('close', function () {
      data.forEach(function (o) {
        // if there is no data for the key, create the key and make the value 
        // an empty array
        var county = o.state + '-' + o.county;
        o.county = county;
        if (!dataHashedByCounty[county]) {dataHashedByCounty[county] = {};}
        var date = o.date;
        var hash = dataHashedByCounty[county];
        hash[date] = o;
        dates[date] = true;
      });
    
      sortedDates = Object.keys(dates).sort();
      var rows = [];
      rows[0] = ['Date'].concat(sortedDates);
    
      Object.keys(dataHashedByCounty).forEach(function(county) {
        var newRow = generateRowForCounty(sortedDates, dataHashedByCounty[county], dataSet);
        rows.push(newRow);
      });
  
      resolve(rows);
    });
    
  });
}




function generateRowForCounty(dates, dataHashedByDate, key) {
  var output = '';
  var data  = [];
  // Get the state out of the data 
  // We don't know here what dates for which we have data, so just get 
  // all the keys and use the first one
  var county = dataHashedByDate[Object.keys(dataHashedByDate)[0]].county;

  dates.forEach(function(d) {
    var o = dataHashedByDate[d];
    if (undefined !== o) {
      data.push(+o[key]);
    }  else {
      data.push(0);
    }
  });

  var row = [county].concat(data);

  return row;
}


module.exports.getCountyDataFromFile = getCountyDataFromFile;