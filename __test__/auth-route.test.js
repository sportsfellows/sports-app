'use strict';

const request = require('superagent');
const fakeUser  = require('./lib/fakeUser.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

const testUser = {
  username: 'testUserName',
  email: 'testEmail',
  password: 'testPassword',
};

describe('Auth routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });
  afterEach(fakeUser.remove);


  describe('POST: /api/signup', function() {
    describe('with a valid body', function() {
      it('should return a token', done => { 
        request.post(`${url}/api/signup`)
          .send(testUser)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.text).toEqual('string');
            done();
          });
      });

      it('should return a 400 error, no body', done => {
        request.post(`${url}/api/signup`)
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
  });

  describe('GET: /api/signin', function() {
    describe('with a valid body', function() {
      beforeEach(() => {
        return fakeUser.create()
          .then( mock => this.mock = mock);
      }); 

      it('return a token', done => {
        request.get(`${url}/api/signin`)
          .auth(this.mock.user.username, this.mock.request.password)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.text).toEqual('string');
            done();
          });
      });

      it('should return a 401 when user cant be authenticated', done => {
        request.get(`${url}/api/signin`)
          .auth('fakeuser', 'fakepassword')
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
      it('should return a 401 when user cant be authenticated', done => {
        request.get(`${url}/api/signin`)
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
      it('should return a 401 when user cant be authenticated', done => {
        request.get(`${url}/api/signin`)
          .set('Authorization', 'somestuff')
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
      it('should return a 401 when user cant be authenticated', done => {
        request.get(`${url}/api/signin`)
          .set('Authorization', 'Basic somestuff')
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
    });
  });
});