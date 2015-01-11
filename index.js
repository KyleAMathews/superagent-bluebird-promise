// From https://gist.github.com/epeli/11209665

var Promise = require("bluebird");

var Request = require("superagent").Request;

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
