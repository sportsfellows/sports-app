'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const faker = require('faker');
const fakeTeam = require('./lib/fakeTeam.js');

require('jest');

const url = 'http://localhost:3000';

describe('SportingEvent routes', function () {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });

  beforeEach(() => {
    return fakeTeam.create()
      .then(mock => {
        this.mock = mock;
      });
  });

  afterEach(fakeTeam.remove);

  it('should post and return a team', done => {
    const teamRequest = {
      teamName: faker.name.firstName(),
      seed: faker.random.number(),
      pretournamentRecord: faker.random.number() + ' - ' + faker.random.number(),
    };

    request.post(`${url}/api/sportingevent/${this.mock.teamRequest.sportingEventID}/team`)
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .send(teamRequest)

      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(200);
        done();
      });
  });

  it('should not return a team', done => {
    // const teamRequest = {};

    request.post(`${url}/api/sportingevent/${this.mock.teamRequest.sportingEventID}/team`)
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .send(null)

      .end(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400);
        done();
      });
  });
});
