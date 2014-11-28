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
  var self = this;
  return new Promise(function(resolve, reject) {
      self.end(function(err, res) {
        if (typeof res != 'undefined' && res.status >= 400) {
          reject({
            status: res.status,
            res: res,
            error: res.error
          });
        } else if (err) {
          reject({
            error: err
          });
        } else {
          resolve(res);
        }
      });
    });
};
