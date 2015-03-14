chai = require 'chai'
expect = chai.expect
sinon = require 'sinon'
Promise = require 'bluebird'
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

  it 'should reject an error object when the
      returned statusCode is > 400', (done) ->
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
        done()

  it 'should reject an error object when requesting
      non-existent page', (done) ->
    request.get("http://example.com/does-not-exist")
      .promise()
      .then (res) ->
        expect(res).to.not.exist
        done()
      .catch (error) ->
        expect(error).to.exist
        expect(error.res).to.exist
        expect(error.status).to.exist
        expect(error.body).to.exist
        expect(error).to.be.instanceof(Error)
        expect(error.name).to.equal("SuperagentPromiseError")
        expect(error.message)
          .to.equal("cannot GET http://example.com/does-not-exist (404)")
        done()

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

  describe 'cancellable promises', ->

    beforeEach ->
      sinon.stub request.Request.prototype, 'abort'

    afterEach ->
      request.Request.prototype.abort.restore()

    describe 'cancel without reason', ->

      it 'should abort the request when the promise is cancelled', (done) ->
        request.get("localhost:3000/good")
          .promise()
          .catch(->)
          .cancel()

        setImmediate ->
          expect(request.Request.prototype.abort.called).to.be.true
          done()

      it 'should throw a bluebird CancellationError when the
          promise is cancelled without a reason', (done) ->
        errorSpy = sinon.spy()

        request.get("localhost:3000/good")
          .promise()
          .catch errorSpy
          .cancel()

        setImmediate ->
          expect(errorSpy.calledWith(
            sinon.match.instanceOf(Promise.CancellationError))
          ).to.be.true
          done()

    describe 'cancel with reason that subclasses CancellationError', ->

      class CustomCancellationError extends Promise.CancellationError

      it 'should abort the request when the promise is cancelled', (done) ->
        request.get("localhost:3000/good")
          .promise()
          .catch(->)
          .cancel new CustomCancellationError

        setImmediate ->
          expect(request.Request.prototype.abort.called).to.be.true
          done()

      it 'should throw a custom error when the promise is
          cancelled with a reason', (done) ->
        errorSpy = sinon.spy()

        request.get("localhost:3000/good")
          .promise()
          .catch errorSpy
          .cancel new CustomCancellationError

        setImmediate ->
          expect(errorSpy.calledWith(
            sinon.match.instanceOf(CustomCancellationError)
          )).to.be.true
          done()
