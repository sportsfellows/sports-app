'use strict';

const request = require('superagent');
const faker = require('faker');
const fakeTeam = require('./lib/fakeTeam.js');
const Game = require('../model/league/userPick.js');
const UserPick = require('../model/league/userPick.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

let exampleGame = {
  groupName: faker.company.companyName(),
  privacy: 'public',
};

let exampleUserPick = {

};

describe('Game Routes', function () {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });

  beforeEach( () => {
    return fakeTeam.create()
      .then(mock => {
        this.home.mock = mock;
      });
  });

  beforeEach( () => {
    return fakeTeam.create()
      .then(mock => {
        this.away.mock = mock;
      });
  });

  beforeEach(done => {
    exampleGroup.owner = this.mock.profile.userID;
    exampleGroup.users = [this.mock.profile.userID];

    new Group(exampleGroup).save()
      .then(group => {
        this.tempGroup = group;
        done();
      })
      .catch(done);
  });

  afterEach(done => {
    Promise.all([
      fakeProfile.remove,
      Group.remove({}),
    ])
      .then(() => done())
      .catch(done);
  });


});