'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
// const fakeSportingEvent = require('./lib/fakeSportingEvent.js');
const fakeTeam = require('./lib/fakeTeam.js');
// const fakeUser = require('./lib/fakeUser.js');

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
    return fakeTeam.create()
      .then(mock => {
        this.mock = mock;
      });
  });

  afterEach(fakeTeam.remove);

  it('should', () => {
    console.log(JSON.stringify(this.mock, null, 2));
  });
});
// Don't write any code below this line
