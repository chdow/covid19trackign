'use strict';

var google = require('./google.js');
var getStateDataFromFile = require('./nytdata-states.js').getStateDataFromFile;

const input = process.env.input;

function fatalError(err) {
  console.log(err);
  process.exit(-1);
}

var sheetID = '1ptKcB8kGJOfYSE9-64v4slYraY4CRpb5yb64WATUzH4';
var sheets;

google.initialize().
then(auth => {
  sheets = google.getSheets(auth);
}).
then( function () {
  return getStateDataFromFile(input);
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
      range: 'states!A1',
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
  console.log('%d cells updated.', result.data.updatedCells);
}).
then( () =>  {
  process.exit(0);
}).
catch(fatalError);


