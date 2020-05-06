'use strict';

var Covidtracking = require('./covidtracking.js');

var covidtracking = new Covidtracking();

covidtracking.counties().
then(function (data) {
  console.log(JSON.stringify(data, null, '  '));
  process.exit(0);
}).
catch(function (err) {
  console.error(err);
  process.exit(-1);
});