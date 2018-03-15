'use strict';

const request = require('superagent');
const fakeProfile  = require('./lib/fakeProfile.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

describe('Profile routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });
  beforeEach( () => {
    return fakeProfile.create()
      .then( mock => {
        this.mock = mock;
        return this.mock.profile = this.mock.profile._rejectionHandler0;
      });
  }); 
  afterEach( done => {
    Promise.all([
      fakeProfile.remove,
    ])
      .then( () => done())
      .catch(done);
  });

  describe('GET: /api/profile/:profileId', () => {
    describe('with a valid body', () => {
      it('should return a profile', done => { 
        request.get(`${url}/api/profile/${this.mock.profile._id}`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.text).toEqual('string');
            expect(res.body.status).toEqual(this.mock.profile.status);
            expect(res.body.tags.toString()).toEqual(this.mock.profile.tags.toString());
            expect(res.body.image).toEqual(this.mock.profile.image);
            expect(res.body.country).toEqual(this.mock.profile.country);
            expect(res.body.state).toEqual(this.mock.profile.state);
            expect(res.body.birthdate).toEqual(this.mock.profile.birthdate);
            expect(res.body._id.toString()).toEqual(this.mock.profile._id.toString());
            expect(res.body.userID.toString()).toEqual(this.mock.profile.userID.toString());
            expect(res.body.username).toEqual(this.mock.profile.username);
            done();
          });
      });
    //     it('should return a 400 error, no body', done => {
    //       request.post(`${url}/api/signup`)
    //         .send()
    //         .set({
    //           Authorization: `Bearer ${this.tempToken}`,
    //         })
    //         .end((err, res) => {
    //           expect(res.status).toEqual(400);
    //           done();
    //         });
    //     });
    });
  });
});