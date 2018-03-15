'use strict';

const request = require('superagent');
const User = require('../model/user/user.js');
const Profile = require('../model/user/profile.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

const {exampleUser, exampleProfile} = require('./lib/mockData.js');

describe('Profile routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });
  beforeEach( done => {
    new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        let profile = new Profile({userID: user._id, username: user.username}).save();
        this.tempProfile = profile;
        return user;
      })
      .then( user => {
        this.tempUser = user;
        console.log('this.tempUser: ', this.tempUser)
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
  });
  return new Profile({userID: user._id, username: user.username}).save();
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Profile.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  describe('GET: /api/signup', function() {
    describe('with a valid body', function() {


      it('should return a token', done => { 
        request.post(`${url}/api/signup`)
          .send(exampleUser)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.text).toEqual('string');
            done();
          });
      });

      it('should return a 400 error, no body', done => {
        request.post(`${url}/api/signup`)
          .send()
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
  
    });
  });