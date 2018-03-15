'use strict';

describe('User Pick routes', function() {
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
