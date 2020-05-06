'use strict';

var google = require('./google.js');
var getCountyDataFromFile = require('./nytdata-counties.js').getCountyDataFromFile;

const input = process.env.input;

function fatalError(err) {
  console.log(err);
  process.exit(-1);
}

var sheetID = '1A8EBz1u-tLTTVNtTJz0sXJqPt-QV7CC9OQTJ4cT5-lU';
var sheets;



google.initialize().
then(auth => {
  sheets = google.getSheets(auth);
}).
then( function () {
  return getCountyDataFromFile(input);
}).
then(data => {
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
      range: 'counties!A1',
      valueInputOption: 'USER_ENTERED',
      resource : {values: data}
    }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
    // [END sheets_update_values]
  });


}).
then ( (result) => {
  console.log('%d cells updated', result.data.updatedCells);
}).
then( () =>  {
  process.exit(0);
}).
catch(fatalError);


