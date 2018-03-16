'use strict';

const request = require('superagent');
const fakeProfile  = require('./lib/fakeProfile.js');
const SportingEvent = require('../model/sportingEvent/sportingEvent.js');
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
  }); 
  afterEach( done => {
    Promise.all([
      fakeProfile.remove,
      SportingEvent.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  it('should post and return a sportingevent', done => {
    request.post(`${url}/api/sportingevent`)
      .send(exampleSportingEvent)
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(200);
        expect(res.body.sportingEventName).toEqual(exampleSportingEvent.sportingEventName);
        expect(res.body.desc).toEqual(exampleSportingEvent.desc);
        expect(res.body.tags.toString()).toEqual(exampleSportingEvent.tags.toString());
        done();
      });
  });

  it('should return 404 for route not found', done => {
    request.post(`${url}/api/sportingeve`)
      .send(exampleSportingEvent)
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .end((err, res) => {
        expect(res.status).toEqual(404);
        done();
      });
  });

  it('should return a 401 error, no token', done => {
    request.post(`${url}/api/sportingevent`)
      .send(exampleSportingEvent)
      .set({
        Authorization: 'Bearer ',
      })
      .end((err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });

  it('should return a 400 error, body error', done => {
    request.post(`${url}/api/sportingevent`)
      .send(exampleSportingEvent2)
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .end((err, res) => {
        expect(res.status).toEqual(400);
        done();
      });
  });


  describe('GET: /api/sportingevent/:sportingEventId', () => {
    // beforeEach( done => {
    //   return new SportingEvent(updatedSportingEvent).save()
    //     .then( sportingEve => {
    //       console.log('sportingeve ', sportingEve);
    //       this.sportingEvent = sportingEve;
    //       done();
    //     })
    //     .catch(done);
    // });

    beforeEach( done => {
      return new SportingEvent(updatedSportingEvent).save()
        .then( sportingEve => {
          console.log('sportingeve ', sportingEve);
          this.sportingEvent = sportingEve;
          done();
        })
        .catch(done);
    });
    
    describe('with a valid body', () => {
      it('should return a single sporting event', done => { 
        request.get(`${url}/api/sportingevent/${this.sportingEvent._id}`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.sportingEventName).toEqual(updatedSportingEvent.sportingEventName);
            expect(res.body.tags.toString()).toEqual(updatedSportingEvent.tags.toString());
            expect(res.body.desc).toEqual(updatedSportingEvent.desc);
            done();
          });
      });

      it('should return a 401 when no token is provided', done => {
        request.get(`${url}/api/sportingevent/${this.sportingEvent._id}`)
          .set({
            Authorization: 'Bearer',
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });

      it('should return a 404 for a valid req with a list id not found', done => {
        request.get(`${url}/api/sportingevent/a979e472c577c679758e018`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });

      it('should return all sporting events', done => { 
        request.get(`${url}/api/sportingevents`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            console.log('res.body: ', res.body);
            expect(res.body[0].sportingEventName).toEqual(updatedSportingEvent.sportingEventName);
            expect(res.body[0].tags.toString()).toEqual(updatedSportingEvent.tags.toString());
            expect(res.body[0].desc).toEqual(updatedSportingEvent.desc);
            done();
          });
      });

    });
  });
});

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