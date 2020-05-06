'use strict';

var getStateDataFromFile = require('./nytdata-states.js').getStateDataFromFile;

const input = process.env.input;

getStateDataFromFile(input).
then(data => {
  data.forEach(row => {
    console.log(row.join(','));
  });
}).
then( () => {
  process.exit(0);
}).
catch(err => {
  console.error(err);
  process.exit(-1);
});