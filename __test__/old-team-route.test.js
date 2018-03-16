'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const fakeSportingEvent = require('./lib/fakeSportingEvent.js');
const fakeTeam = require('./lib/fakeTeam.js');
const fakeProfile = require('./lib/fakeProfile.js');

require('jest');

const url = 'http://localhost:3000';

describe('SportingEvent routes', function () {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });

  beforeEach( () => {
    return fakeProfile.create()
      .then( mock => {
        this.mock = mock;
        return this.mock.profile = this.mock.profile_rejectionHandler0;
      });
  });

  afterEach( done => {
    Promise.all([
      fakeProfile.remove,
      fakeSportingEvent.remove,
      fakeTeam.remove,
    ])
      .then( () => done())
      .catch(done);
  });

  describe('GET: /api/sportingEvent/:sportingEventId', () => {
    beforeEach(done => {
      return fakeTeam.create()
        .then(team => {
          this.fakeTeam = team;
        })
        .then(token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });

    beforeEach(done => {
      fakeSportingEvent.create()
        .then(sportingEvent => {
          this.fakeSportingEvent = sportingEvent;
          done();
        })
        .catch(done);
    });
  });
});

afterEach(() => {
  delete fakeSportingEvent.teamID;
});

it('should return a sportingEvent and a 200 status', done => {
  request.get(`${url}/api/sportingEvent/${fakeSportingEvent.id}`)
    .set({
      Authorization: `Bearer ${this.tempToken}`,
    })
    .end((err, res) => {
      if (err) return done(err);
      expect(res.status).toEqual(200);
      expect(res.body.name).toEqual(fakeSportingEvent.name);
      expect(res.body.desc).toEqual(fakeSportingEvent.desc);
      expect(res.body.teamID).toEqual(fakeTeam.id.toString());
      done();
    });
});

it('should return a 401 when no token is provided', done => {
  request.get(`${url}/api/sportingEvent/${fakeSportingEvent.id}`)
    .set({
      Authorization: 'Bearer',
    })
    .end((err, res) => {
      expect(res.status).toEqual(401);
      done();
    });
});

it('should return a 404 for a valid req with a sportingEvent id not found', done => {
  request.get(`${url}/api/sportingEvent/a979e472c577c679758e018`)
    .set({
      Authorization: `Bearer ${this.tempToken}`,
    })
    .end((err, res) => {
      expect(res.status).toEqual(404);
      done();
    });
});

it('should return all sportingEvents and a 200 status', done => {
  request.get(`${url}/api/sportingEvents`)
    .set({
      Authorization: `Bearer ${this.tempToken}`,
    })
    .end((err, res) => {
      if (err) return done(err);
      expect(res.status).toEqual(200);
      expect(res.body.name).toEqual(fakeSportingEvent.name);
      expect(res.body.desc).toEqual(fakeSportingEvent.desc);
      expect(res.body.teamID).toEqual(fakeTeam.id.toString());
      done();
    });
});

it('should return a 401 when no token is provided', done => {
  request.get(`${url}/api/sportingEvents`)
    .set({
      Authorization: 'Bearer',
    })
    .end((err, res) => {
      expect(res.status).toEqual(401);
      done();
    });
});