'use strict';

const request = require('superagent');
const faker = require('faker');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

const fakeLeague = require('./lib/fakeLeague.js');

require('jest');

const url = 'http://localhost:3000';

const exampleLeague = { 
  leagueName: faker.company.companyName(), 
  scoring: 'some scoring',
  poolSize: faker.random.number(), 
  privacy: 'public' };


describe('League routes', function() {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });
  
  beforeEach( () => {
    return fakeLeague.create()
      .then( mock => {
        return this.mock = mock;
      });
  });
  afterEach( done => {
    Promise.all([
      fakeLeague.remove(),
    ])
      .then( () => done())
      .catch(done);
  });
  it('should post and return a league', done => {
    request.post(`${url}/api/sportingevent/${this.mock.leagueRequest.sportingEventID}/league`)
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .send(exampleLeague)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(200);
        // expect(res.body.leagueName).toEqual(exampleLeague.leagueName);
        // expect(res.body.scoring).toEqual('some scoring');
        // expect(res.body.poolSize).toEqual(exampleLeague.poolSize);
        // expect(res.body.privacy).toEqual(exampleLeague.privacy);
        done();
      });
  });

});

