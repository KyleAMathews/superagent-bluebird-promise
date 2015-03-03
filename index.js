// From https://gist.github.com/epeli/11209665

var Promise = require("bluebird");

// So you can `var request = require("superagent-bluebird-promise")`
var superagent = module.exports = require("superagent");
var Request = superagent.Request;

// Create custom error type.
// Create a new object, that prototypally inherits from the Error constructor.
function SuperagentPromiseError(message) {
  this.name = 'SuperagentPromiseError';
  this.message = message || 'Bad request';
}

SuperagentPromiseError.prototype = new Error();
SuperagentPromiseError.prototype.constructor = SuperagentPromiseError;

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
  var self = this;
  var error;
  return new Promise(function(resolve, reject) {
      self.end(function(err, res) {
        if (typeof res !== "undefined" && res.status >= 400) {
          var msg = 'cannot ' + self.req.method + ' ' + self.req._headers.host + self.req.path + ' (' + res.status + ')';
          error = new SuperagentPromiseError(msg);
          error.status = res.status;
          error.body = res.body;
          error.res = res;
          reject(error);
        } else if (err) {
          reject(new SuperagentPromiseError(err));
        } else {
          resolve(res);
        }
      });
    });
};
