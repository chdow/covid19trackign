'use strict';

var google = require('./google.js');
const readline = require('readline');
const fs       = require('fs');

function fatalError(err) {
  console.log(err);
  process.exit(-1);
}

const input = process.env.input;

var sheetID = '1CdZ0GFiUOUmS4QHmdxsyaJUIX3hZW5mPPyDXUtDT0x8';
var sheets;



google.initialize().
then(auth => {
  sheets = google.getSheets(auth);
}).
then( function () {
  return new Promise((resolve, reject) => {
    var inputStream = fs.createReadStream(input);
    var data = [];
    var rl = readline.createInterface({
      input: inputStream
    });

    rl.on('line', function (line) {
      var row = line.split(',');
      data.push(row);
    });

    rl.on('close', () => {
      return resolve (data);
    }); 

  });
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
      valueInputOption: 'USER_ENTERED',
      resource : {values: data}
    }, (err, result) => {
      if (err) {
        // Handle error
        console.log(err);
        // [START_EXCLUDE silent]
        reject(err);
        // [END_EXCLUDE]
      } else {
        console.log('%d cells updated.', result.data.updatedCells);
        // [START_EXCLUDE silent]
        resolve(result);
        // [END_EXCLUDE]
      }
    });
    // [END sheets_update_values]
  });
}).
then( () =>  {
  process.exit(0);
}).
catch(fatalError);


