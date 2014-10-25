superagent-bluebird-promise
===========================

Add promises support to superagent using Bluebird

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
