// From https://gist.github.com/epeli/11209665

var Promise = require("bluebird");

// So you can `var request = require("superagent-bluebird-promise")`
var superagent = module.exports = require("superagent");
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
  var self = this;
  return new Promise(function(resolve, reject) {
      self.end(function(err, res) {
        if (typeof res !== "undefined" && res.status >= 400) {
          var msg = 'cannot ' + self.req.method + ' ' + self.req.url + ' (' + res.status + ')';
          var error = new Error(msg);

          error.status = res.status;
          error.res = res;
          error.error = res.error;

          reject(err);
        } else if (err) {
          var error = new Error(err.message);
          error.error = err;
          
          reject(error);
        } else {
          resolve(res);
        }
      });
    });
};
