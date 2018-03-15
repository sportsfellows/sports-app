'use strict';

const request = require('superagent');
const faker = require('faker');
const fakeUser = require('.lib/fakeUser/user.js');
const Group = require('../model/league/group.js');
const MessageBoard = require('../model/league/messageBoard.js')
const Comment = require('../model/league/comment.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

const exampleGroup = {
  groupName: faker.company.companyName(),
  private: 'public',
}

const exampleComment = {
  content: faker.lorem.sentences()
}


describe('Comment routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });
  afterEach( done => {
    Promise.all([
      fakeProfile.remove(),
      Group.remove({}),
      MessageBoard.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });
  beforeEach(() => {
    return fakeProfile.create())
    .then( mock => this.mock = mock)
  beforeEach(//make a group)
  beforeEach(//make a messageboard)
  beforeEach(//make an example comment)

  describe('POST: /api/comment', function() {
    
  })
});

