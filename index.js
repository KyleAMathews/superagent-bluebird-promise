// From https://gist.github.com/epeli/11209665

var Promise = require("bluebird");

// sometime we just want `var request = require('superagent-bluebird-promise')`
var superagent = module.exports = require('superagent');
var Request = superagent.Request;

/**
 * @namespace utils
 * @class Superagent
 */

/**
 *
 * Add promise support for superagent/supertest
 *
 * Call .promise() to return promise for the request
 *
 * @method promise
 * @return {Bluebird.Promise}
 */
Request.prototype.promise = function() {
  var defer = Promise.defer();
  this.end(defer.callback);
  return defer.promise;
};
