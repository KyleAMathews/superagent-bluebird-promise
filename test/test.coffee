chai = require 'chai'
expect = chai.expect
_ = require 'underscore'
Interfake = require('interfake')
interfake = new Interfake()

interfake.get('/good').body({message: 'ok'})
interfake.get('/bad').status(400).body({error: 'not ok'})
interfake.listen(3000) # The server will listen on port 3000

request = require '../'


describe 'superagent-promise', ->
  it 'should exist', ->
    expect(request).to.exist

  it 'should resolve a res object when the returned statusCode is < 400', ->
    request.get("localhost:3000/good")
      .promise()
      .then (res) ->
        expect(res).to.exist
        expect(res.status).to.equal(200)
        expect(res.body.message).to.equal('ok')

  it 'should reject an error object when the returned statusCode is > 400', ->
    request.get("localhost:3000/bad")
      .promise()
      .then (res) ->
        expect(res).to.not.exist
      .catch (error) ->
        expect(error).to.exist
        expect(error.res).to.exist
        expect(error.status).to.exist
        expect(error.body).to.exist
        expect(error.res.body.error).to.equal('not ok')
        expect(error.body.error).to.equal('not ok')
        expect(error).to.be.instanceof(Error)
        expect(error.name).to.equal("SuperagentPromiseError")
        expect(error.message).to.equal("cannot GET localhost:3000/bad (400)")

  it 'should reject an error object when there is an http error', ->
    request.get("localhost:23423")
      .promise()
      .then (res) ->
        expect(res).to.not.exist
      .catch (error) ->
        expect(error).to.exist
        expect(error).to.be.instanceof(Error)
        expect(error.name).to.equal("SuperagentPromiseError")
        expect(error.message.code).to.equal("ECONNREFUSED")
