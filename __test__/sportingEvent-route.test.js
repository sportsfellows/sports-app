'use strict';

const request = require('superagent');
const fakeProfile  = require('./lib/fakeProfile.js');
const fakeSportingEvent = require('./lib/fakeSportingEvent.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

const updatedSportingEvent = { sportingEventName: 'updated name', desc: 'updated desc', tags: 'updated tag' };
const exampleSportingEvent = { sportingEventName: 'example name', desc: 'example desc', tags: 'example tag' };
const exampleSportingEvent2 = { desc: 'example desc', tags: 'example tag' };

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
    // beforeEach( () => {
    //   return fakeSportingEvent.create()
    //     .then( sportingEvent => {
    //       return this.mock.sportingEvent = sportingEvent;
    //     });
    // });
  }); 
  afterEach( done => {
    Promise.all([
      fakeProfile.remove,
      fakeSportingEvent.remove,
    ])
      .then( () => done())
      .catch(done);
  });

  it('should post and return a sportingevent', done => {
    console.log('this.mock: ', this.mock);
    request.post(`${url}/api/sportingevent`)
      .send(exampleSportingEvent)
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .end((err, res) => {
        console.log('this.mock.profile: ', this.mock.profile);
        if (err) return done(err);
        expect(res.status).toEqual(200);
        expect(res.body.sportingEventName).toEqual(exampleSportingEvent.sportingEventName);
        expect(res.body.desc).toEqual(exampleSportingEvent.desc);
        expect(res.body.tags.toString()).toEqual(exampleSportingEvent.tags.toString());
        done();
      });
  });

  // it('should return 404 for route not found', done => {
  //   request.post(`${url}/api/sportingevent`)
  //     .send(exampleSportingEvent)
  //     .set({
  //       Authorization: `Bearer ${this.mock.token}`,
  //     })
  //     .end((err, res) => {
  //       expect(res.status).toEqual(404);
  //       done();
  //     });
  // });

  // it('should return a 401 error, no token', done => {
  //   request.post(`${url}/api/sportingevent`)
  //     .send(exampleSportingEvent)
  //     .set({
  //       Authorization: 'Bearer ',
  //     })
  //     .end((err, res) => {
  //       expect(res.status).toEqual(401);
  //       done();
  //     });
  // });

  // it('should return a 400 error, no body', done => {
  //   request.post(`${url}/api/sportingevent`)
  //     .send(exampleSportingEvent)
  //     .set({
  //       Authorization: `Bearer ${this.mock.token}`,
  //     })
  //     .end((err, res) => {
  //       expect(res.status).toEqual(400);
  //       done();
  //     });
  // });

  // it('should return a 400 error, body error', done => {
  //   request.post(`${url}/api/sportingevent`)
  //     .send(exampleSportingEvent2)
  //     .set({
  //       Authorization: `Bearer ${this.mock.token}`,
  //     })
  //     .end((err, res) => {
  //       expect(res.status).toEqual(400);
  //       done();
  //     });
  // });
});

//   describe('GET: /api/profile/:profileId', () => {
//     describe('with a valid body', () => {
//       it('should return a profile', done => { 
//         request.get(`${url}/api/profile/${this.mock.profile._id}`)
//           .set({
//             Authorization: `Bearer ${this.mock.token}`,
//           })
//           .end((err, res) => {
//             if (err) return done(err);
//             expect(res.status).toEqual(200);
//             expect(typeof res.text).toEqual('string');
//             expect(res.body.status).toEqual(this.mock.profile.status);
//             expect(res.body.tags.toString()).toEqual(this.mock.profile.tags.toString());
//             expect(res.body.image).toEqual(this.mock.profile.image);
//             expect(res.body.country).toEqual(this.mock.profile.country);
//             expect(res.body.state).toEqual(this.mock.profile.state);
//             expect(res.body.birthdate).toEqual(this.mock.profile.birthdate);
//             expect(res.body._id.toString()).toEqual(this.mock.profile._id.toString());
//             expect(res.body.userID.toString()).toEqual(this.mock.profile.userID.toString());
//             expect(res.body.username).toEqual(this.mock.profile.username);
//             done();
//           });
//       });

//       it('should return a 401 when no token is provided', done => {
//         request.get(`${url}/api/profile/${this.mock.profile._id}`)
//           .set({
//             Authorization: 'Bearer',
//           })
//           .end((err, res) => {
//             expect(res.status).toEqual(401);
//             done();
//           });
//       });
  
//       it('should return a 404 for a valid req with a list id not found', done => {
//         request.get(`${url}/api/profile/a979e472c577c679758e018`)
//           .set({
//             Authorization: `Bearer ${this.mock.token}`,
//           })
//           .end((err, res) => {
//             expect(res.status).toEqual(404);
//             done();
//           });
//       });
//     });
//   });

//   describe('PUT: /api/profile/:profileId', () => {
//     describe('with a valid body', () => {
//       it('should update and return a list with a 200 status', done => {
//         request.put(`${url}/api/profile/${this.mock.profile._id}`)
//           .send(updatedProfile)
//           .set({
//             Authorization: `Bearer ${this.mock.token}`,
//           })
//           .end((err, res) => {
//             if (err) return done(err);
//             expect(res.status).toEqual(200);
//             expect(res.body.username).toEqual(updatedProfile.username);
//             expect(res.body.userID.toString()).toEqual(this.mock.profile.userID.toString());
//             done();
//           });
//       });

//       it('should  not update and return a 400 status for invalid req', done => {
//         request.put(`${url}/api/profile/${this.mock.profile._id}`)
//           .send()
//           .set({
//             Authorization: `Bearer ${this.mock.token}`,
//           })
//           .end((err, res) => {
//             expect(res.status).toEqual(400);
//             done();
//           });
//       });

//       it('should  not update and return a 401 status', done => {
//         request.put(`${url}/api/profile/${this.mock.profile._id}`)
//           .send(updatedProfile)
//           .set({
//             Authorization: `Bearer `,
//           })
//           .end((err, res) => {
//             expect(res.status).toEqual(401);
//             done();
//           });
//       });

//       it('should  not update and return a 404 status for user list not found', done => {
//         request.put(`${url}/api/profile/a979e472c577c679758e018`)
//           .send(updatedProfile)
//           .set({
//             Authorization: `Bearer ${this.mock.token}`,
//           })
//           .end((err, res) => {
//             expect(res.status).toEqual(404);
//             done();
//           });
//       });
//     });
//   });
// });