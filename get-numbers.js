'use strict';

var google = require('./google.js');
var Covidtracking = require('./covidtracking.js');
var getUSHistory = require('./getushistory.js');
const regression = require('regression');

function fatalError(err) {
  console.log(err);
  process.exit(-1);
}

var sheetID = process.env.sheet || fatalError('must specify sheet in env');
var tab = process.env.tab || fatalError('must specify tab in env');
var sheets;


google.initialize().
then(auth => {
  sheets = google.getSheets(auth);
}).
then ( () => {
  return new Promise( (resolve, reject) => {
    sheets.spreadsheets.values.get({
      spreadsheetId: sheetID,
      range: tab+'!B5:C1000'
    }, (err, res) => {
      if (err) {return reject(err);}

      var data = [];
      res.data.values.forEach(element => {
        if (null != element[1]) {
          data.push([+element[0], +element[1]]);
        }
      });

      resolve(data);
    });
  });
}).
then(data => {
  var results = [];
  for (var order = 0; order < 8; order++) {
    var result = regression.polynomial(data, {order: order, precision: 4});
    var errors = [];
    
    for (var i = 0; i < data.length; i++) {
      errors.push((result.points[i][1]/data[i][1]) - 1);
    }
    var errorSum = 0;
    var averageError;

    errors.forEach(element => {
      errorSum += element;
    });
    averageError = errorSum / errors.length;
    var lastIndex = data.length - 1;
    var lastPointError = result.points[lastIndex][1] - data[lastIndex][1];
    results.push({
      order: order,
      string: result.string,
      points: result.points,
      equation: result.equation,
      error: averageError,
      lastPointError: lastPointError
    });

  }

  var chosen;  
  var minLastPointError = Math.abs(results[0].lastPointError);
  results.forEach(element => {
    if (Math.abs(element.lastPointError) < Math.abs(minLastPointError)) {
      minLastPointError = element.lastPointError;
      chosen = element;
    }
  });
  
  results.forEach(element => {
    console.log("%s: , error: %s\%", element.string, (element.error * 100).toFixed(2));
  });

  delete chosen.points;
  console.log(chosen);

  return (chosen);

}).
then (result => {
  return new Promise((resolve, reject) => {
    
    var equationCells = [];
    for (var i = 0; i < (8 - result.equation.length); i++) {
      equationCells.push('');
    }
    result.equation.forEach(element => {
      equationCells.push(element);
    });
     
    sheets.spreadsheets.values.update({
      spreadsheetId: sheetID,
      range: tab+'!J2',
      valueInputOption: 'USER_ENTERED',
      resource : {values: [equationCells]}
    }, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log('%d cells updated', res.data.updatedCells);
        resolve(result);
      }
    });
  });
}).
then(result => {
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.update({
      spreadsheetId: sheetID,
      range: tab+'!A3',
      valueInputOption: 'USER_ENTERED',
      resource : {values: [[result.string]]}
    }, (err, res) => {
      if (err) {
        // Handle error
        console.log(err);
        // [START_EXCLUDE silent]
        reject(err);
        // [END_EXCLUDE]
      } else {
        console.log('%d cells updated', res.data.updatedCells);
        resolve();
      }
    });
  });
}).
then( () =>  {
  process.exit(0);
}).
catch(fatalError);


