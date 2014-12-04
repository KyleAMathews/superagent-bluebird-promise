superagent-bluebird-promise
===========================

Add promise support to superagent using Bluebird.

## Install
`npm install superagent-bluebird-promise`

## Usage
Simple require this package somewhere in your app and then you can call `.promise()` instead of `.end()` to get a promise for your requests.

```javascript

var request = require('superagent');
require('superagent-bluebird-promise');

request.get('/an-endpoint').promise()
  .then(function(res) {
    console.log(res);
  })
  .catch(function(error) {
    console.log(error);
  })
  ```

An error is thrown for all HTTP errors and responses that have a response code of 400 or above.

The `error` parameter always has a key `error` and for 4xx and 5xx responses, will also have a `status` and `res` key.
