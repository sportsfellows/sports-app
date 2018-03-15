'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

const User = require('../model/user.js');
const List = require('../model/league/league.js');

require('jest');
const url = 'http://localhost:3000';

const exampleLeague = { leagueName: 'test league', scoring: 'some scoring', poolSize: 5, privacy: 'yes' };


describe('League routes', function() {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });
  afterEach( done => {
    Promise.all([
      User.remove({}),
      List.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });
