'use strict';

var restify = require('restify-clients');

function _putOrPost (client, method, path, obj) {
  return new Promise(function (resolve, reject) {
    client[method](path, obj, function(err, req, res, obj) {
      if (err) { return reject(err);}
      return resove([req, res, obj]);
    });
  });
}

function _get (client, path) {
  return new Promise(function (resolve, reject) {
    client.get(path, function(err, req, res, obj) {
      if (err) {return reject(err);}
      return resolve([req, res, obj]);
    });
  });
};

function _head (client, path) {
  return new Promise(function (resolve, reject) {
    client.head(path, function (err, req, res){
      if (err) {return reject(err);}
      return resolve([req,res]);
    });
  });
}

function _post (client, path, obj) {
  return _putOrPost(client, 'post', path, obj);
}

function _put (client, path, obj) {
  return _putOrPost(client, 'put', path, obj);
}

function _delete (client, path) {
  return new Promise(function (resolve, reject) {
    client.del(path, function (err, req, res) {
      if (err) {return reject(err);}
      return resolve([req, res]);
    });
  });
}

module.exports = class {
  constructor (clientOptions) {
    this.client = restify.createJsonClient(clientOptions);
    this.get = function (path) {
      return _get(this.client, path);
    }

    this.head = function (path) {
      return _head(this.client, path);
    }

    this.put = function (path, obj) {
      return _putOrPost(this.client, 'put', path, obj);
    }

    this.post = function (path, obj) {
      return _putOrPost(this.client, 'post', path, obj);
    }

    this.delete = function (path) {
      return _delete(this.client, path);
    }
  }
}