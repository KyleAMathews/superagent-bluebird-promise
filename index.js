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
 * @params {object} [options] Options
 * @config {boolean} [cancellable=false] Return a cancellable promise
 * @return {Bluebird.Promise}
 */
Request.prototype.promise = function(options) {
  var self = this;
  var error;

  options = options || { cancellable: false };

  var promise = new Promise(function(resolve, reject) {
      self.end(function(err, res) {
        if (typeof res !== "undefined" && res.status >= 400) {
          var msg = res.toError().message;
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

  if (options.cancellable) {
    promise = promise
      .cancellable()
      .catch(Promise.CancellationError, function(e) {
        self.abort();
        throw e;
    });
  }

  return promise;
};
