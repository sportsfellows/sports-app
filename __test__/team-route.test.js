'use strict';

const request = require('superagent');
const fakeProfile  = require('./lib/fakeProfile.js');
const SportingEvent = require('../model/sportingEvent/sportingEvent.js');
const Team = require('../model/sportingEvent/team.js');
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
  beforeEach( done => {
    return new SportingEvent(updatedSportingEvent).save()
      .then( sportingEve => {
        console.log('sportingeve ', sportingEve);
        this.sportingEvent = sportingEve;
        done();
      })
      .catch(done);
  });
  afterEach( done => {
    Promise.all([
      fakeProfile.remove,
      SportingEvent.remove({}),
      Team.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  it('should post and return a team', done => {
    request.post(`${url}/api/sportingevent/${this.sportingEvent._id}/team`)
      .send({ teamName: 'Washington State', sportingEventID: this.sportingEvent._id, seed: 1, pretournamentRecord: '20-10', tags: 'PAC-12' })
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(200);
        expect(res.body.teamName).toEqual('Washington State');
        expect(res.body.sportingEventID.toString()).toEqual(this.sportingEvent._id.toString());
        expect(res.body.seed).toEqual(1);
        expect(res.body.pretournamentRecord).toEqual('20-10');
        expect(res.body.tags.toString()).toEqual('PAC-12');
        done();
      });
  });

  it('should return 404 for route not found', done => {
    request.post(`${url}/api/sportingevent/${this.sportingEvent._id}/te`)
      .send({ teamName: 'Washington State', sportingEventID: this.sportingEvent._id, seed: 1, pretournamentRecord: '20-10', tags: 'PAC-12' })
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .end((err, res) => {
        expect(res.status).toEqual(404);
        done();
      });
  });

  it('should return a 401 error, no token', done => {
    request.post(`${url}/api/sportingevent/${this.sportingEvent._id}/team`)
      .send({ teamName: 'Washington State', sportingEventID: this.sportingEvent._id, seed: 1, pretournamentRecord: '20-10', tags: 'PAC-12' })
      .set({
        Authorization: `Bearer `,
      })
      .end((err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });

  it('should return a 400 error, body error', done => {
    request.post(`${url}/api/sportingevent/${this.sportingEvent._id}/team`)
      .send()
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .end((err, res) => {
        expect(res.status).toEqual(400);
        done();
      });
  });


  // describe('GET: /api/sportingevent/:sportingEventId', () => {
  //   beforeEach( done => {
  //     return new SportingEvent(updatedSportingEvent).save()
  //       .then( sportingEve => {
  //         this.sportingEvent = sportingEve;
  //         done();
  //       })
  //       .catch(done);
  //   });
    
  //   describe('with a valid body', () => {
  //     it('should return a single sporting event', done => { 
  //       request.get(`${url}/api/sportingevent/${this.sportingEvent._id}`)
  //         .set({
  //           Authorization: `Bearer ${this.mock.token}`,
  //         })
  //         .end((err, res) => {
  //           if (err) return done(err);
  //           expect(res.status).toEqual(200);
  //           expect(res.body.sportingEventName).toEqual(updatedSportingEvent.sportingEventName);
  //           expect(res.body.tags.toString()).toEqual(updatedSportingEvent.tags.toString());
  //           expect(res.body.desc).toEqual(updatedSportingEvent.desc);
  //           done();
  //         });
  //     });

  //     it('should return a 401 when no token is provided', done => {
  //       request.get(`${url}/api/sportingevent/${this.sportingEvent._id}`)
  //         .set({
  //           Authorization: 'Bearer',
  //         })
  //         .end((err, res) => {
  //           expect(res.status).toEqual(401);
  //           done();
  //         });
  //     });

  //     it('should return a 404 for a valid req with a list id not found', done => {
  //       request.get(`${url}/api/sportingevent/a979e472c577c679758e018`)
  //         .set({
  //           Authorization: `Bearer ${this.mock.token}`,
  //         })
  //         .end((err, res) => {
  //           expect(res.status).toEqual(404);
  //           done();
  //         });
  //     });

  //     it('should return all sporting events', done => { 
  //       request.get(`${url}/api/sportingevents`)
  //         .set({
  //           Authorization: `Bearer ${this.mock.token}`,
  //         })
  //         .end((err, res) => {
  //           if (err) return done(err);
  //           expect(res.status).toEqual(200);
  //           expect(res.body[0].sportingEventName).toEqual(updatedSportingEvent.sportingEventName);
  //           expect(res.body[0].tags.toString()).toEqual(updatedSportingEvent.tags.toString());
  //           expect(res.body[0].desc).toEqual(updatedSportingEvent.desc);
  //           done();
  //         });
  //     });

});
// });
// });
