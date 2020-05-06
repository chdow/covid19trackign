'use strict';

var google = require('./google.js');
var Covidtracking = require('./covidtracking.js');
var getUSHistory = require('./getushistory.js');

function fatalError(err) {
  console.log(err);
  process.exit(-1);
}

var sheetID = process.env.sheet || fatalError('must specify sheet in env');
var sheets;


google.initialize().
then(auth => {
  sheets = google.getSheets(auth);
}).
then( function () {
  return getUSHistory();
}).
then(data => {
//  return updateValues(sheetID, 'Sheet1!A1', 'RAW', data );
  return new Promise((resolve, reject) => {
    // [START sheets_update_values]
    let values = [
      [
        // Cell values ...
      ],
      // Additional rows ...
    ];
    // [START_EXCLUDE silent]
    values = data;
    // [END_EXCLUDE]
    const resource = {
      values,
    };
    sheets.spreadsheets.values.update({
      spreadsheetId: sheetID,
      range: 'Data!A1',
      valueInputOption: 'RAW',
      resource : {values: data}
    }, (err, result) => {
      if (err) {
        // Handle error
        console.log(err);
        // [START_EXCLUDE silent]
        reject(err);
        // [END_EXCLUDE]
      } else {
        console.log('%d cells updated.', result.updatedCells);
        // [START_EXCLUDE silent]
        resolve(result);
        // [END_EXCLUDE]
      }
    });
    // [END sheets_update_values]
  });


}).
then ( () => {
  return new Promise( (resolve, reject) => {
    sheets.spreadsheets.values.get({
      spreadsheetId: sheetID,
      range: 'Sheet1!a1:1'
    }, (err, res) => {
      if (err) {return reject(err);}
      console.log(JSON.stringify(res.data, null, '  '));
      resolve();
    });
  });
}).
then( () =>  {
  process.exit(0);
}).
catch(fatalError);


