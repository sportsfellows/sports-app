'use strict';

const request = require('superagent');
const User = require('../model/user/user.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

const {exampleUser, exampleProfile, exampleTeam, exampleSportingEvent, exampleGame, exampleLeague, exampleGroup, exampleComment} = require('./lib/mockData.js');

describe('Auth routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/signup', function() {
    describe('with a valid body', function() {
      afterEach( done => {
        User.remove({})
          .then( () => done())
          .catch(done);
      });

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

  describe('GET: /api/signin', function() {
    describe('with a valid body', function() {
      beforeEach( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
          .then( user => user.save())
          .then( user => {
            this.tempUser = user;
            done();
          })
          .catch(done);
      });
      afterEach( done => {
        User.remove({})
          .then( () => done())
          .catch(done);
      });

      it('return a token', done => {
        request.get(`${url}/api/signin`)
          .auth('exampleuser', '1234')
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.text).toEqual('string');
            done();
          });
      });

      it('should return a 401 when user cant be authenticated', done => {
        request.get(`${url}/api/signin`)
          .auth('')
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
    });
  });
});

// describe('PUT: /api/signin', function() {
//   describe('with a valid body', function() {
//     beforeEach( done => {
//       new User(exampleUser)
//         .generatePasswordHash(exampleUser.password)
//         .then( user => {
//           this.tempUser = user;
//           return user.generateToken();
//         })
//         .then( token => {
//           this.tempToken = token;
//           done();
//         })
//         .catch(done);
//     });
//     afterEach( done => {
//       User.remove({})
//         .then( () => done())
//         .catch(done);
//     });

//     it('should update and return a list with a 200 status', done => {
//       request.put(`${url}/api/signin`)
//         .send(updatedUser)
//         .set({
//           Authorization: `Bearer ${this.tempToken}`,
//         })
//         .end((err, res) => {
//           if (err) return done(err);
//           console.log(res);
//           expect(res.status).toEqual(200);
//           expect(res.body.username).toEqual(updatedUser.username);
//           expect(res.body.email).toEqual(updatedUser.email);
//           expect(res.body.userID).toEqual(this.tempUser.id.toString());
//           done();
//         });
//     });

//   });
// });
