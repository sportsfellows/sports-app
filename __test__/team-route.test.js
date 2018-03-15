// 'use strict';

// const request = require('superagent');
// const Team = require('../model/sportingEvent/team.js');
// const SportingEvent = require('../model/sportingEvent/sportingEvent.js');
// const serverToggle = require('../lib/server-toggle.js');
// const server = require('../server.js');
// const fakeUser = require('./lib/fakeUser.js');

// require('jest');

// const url = 'http://localhost:3000';

// const { exampleTeam, exampleSportingEvent } = require('./lib/mockData.js');

// describe('SportingEvent routes', function () {
//   beforeAll(done => {
//     serverToggle.serverOn(server, done);
//   });
//   afterAll(done => {
//     serverToggle.serverOff(server, done);
//   });

//   describe('GET: /api/sportingEvent/:sportingEventId', () => {
//     beforeEach(done => {
//       new Team(exampleTeam)
//         .then(team => {
//           this.tempTeam = team;
//           return team();
//         })
//         .then(token => {
//           this.tempToken = token;
//           done();
//         })
//         .catch(done);
//     });

//     beforeEach(done => {
//       exampleSportingEvent.teamID = this.tempTeam.id.toString();
//       new SportingEvent(exampleSportingEvent).save()
//         .then(sportingEvent => {
//           this.tempSportingEvent = sportingEvent;
//           done();
//         })
//         .catch(done);
//     });
//   });
// });

// afterEach(() => {
//   delete exampleSportingEvent.teamID;
// });

// it('should return a sportingEvent and a 200 status', done => {
//   request.get(`${url}/api/sportingEvent/${this.tempSportingEvent.id}`)
//     .set({
//       Authorization: `Bearer ${this.tempToken}`,
//     })
//     .end((err, res) => {
//       if (err) return done(err);
//       expect(res.status).toEqual(200);
//       expect(res.body.name).toEqual(exampleSportingEvent.name);
//       expect(res.body.desc).toEqual(exampleSportingEvent.desc);
//       expect(res.body.teamID).toEqual(this.tempTeam.id.toString());
//       done();
//     });
// });

// it('should return a 401 when no token is provided', done => {
//   request.get(`${url}/api/sportingEvent/${this.tempSportingEvent.id}`)
//     .set({
//       Authorization: 'Bearer',
//     })
//     .end((err, res) => {
//       expect(res.status).toEqual(401);
//       done();
//     });
// });

// it('should return a 404 for a valid req with a sportingEvent id not found', done => {
//   request.get(`${url}/api/sportingEvent/a979e472c577c679758e018`)
//     .set({
//       Authorization: `Bearer ${this.tempToken}`,
//     })
//     .end((err, res) => {
//       expect(res.status).toEqual(404);
//       done();
//     });
// });

// it('should return all sportingEvents and a 200 status', done => {
//   request.get(`${url}/api/sportingEvents`)
//     .set({
//       Authorization: `Bearer ${this.tempToken}`,
//     })
//     .end((err, res) => {
//       if (err) return done(err);
//       expect(res.status).toEqual(200);
//       expect(res.body.name).toEqual(exampleSportingEvent.name);
//       expect(res.body.desc).toEqual(exampleSportingEvent.desc);
//       expect(res.body.teamID).toEqual(this.tempTeam.id.toString());
//       done();
//     });
// });

// it('should return a 401 when no token is provided', done => {
//   request.get(`${url}/api/sportingEvents`)
//     .set({
//       Authorization: 'Bearer',
//     })
//     .end((err, res) => {
//       expect(res.status).toEqual(401);
//       done();
//     });
// });