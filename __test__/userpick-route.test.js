'use strict';

'use strict';

const request = require('superagent');
const fakeUser  = require('./lib/fakeUser.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

describe('User Pick routes', function() {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });
  afterEach( done => {
    Promise.all([
      // User.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });
});