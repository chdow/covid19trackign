'use strict';

var Client = require('./client.js');



module.exports = class {
  constructor () {
    var client = new Client({url:'https://covidtracking.com'});

    function get(path) {
      return new Promise(function (resolve, reject) {
        client.get(path).
        then(function (args) {
          var [req, res, obj] = args;
          resolve(obj);
        }).
        catch(function (err) {
          reject(err);
        });
      });
    }

    this.statesCurrent = function () {
      return get('/api/v1/states/current.json');
    };

    this.statesHistorical = function () {
      return get('/api/v1/states/daily.json');
    };

    this.statesInfo = function () {
      return get('/api/v1/states/info.json');
    };

    this.usCurrent = function () {
      return get('/api/v1/us/current.json');
    };

    this.usHistorical = function () {
      return get('/api/us/daily');
    };

    this.counties = function () {
      return get('/api/counties');
    };

   }
}