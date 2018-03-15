'use strict';

const faker = require('faker');
const Team = require('../../model/sportingEvent/team.js');
const fakeSportingEvent = require('../fakeSportingEvent.js');
const teamMockFactory = module.exports = {};

teamMockFactory.create = () => {
  let mock = {};
  mock.request = {
    teamName: faker.internet.firstName(),
  };

  let team = new Team(mock.request);
  return team.generatePasswordHash(mock.request.password)
    .then(team => team.save())
    .then(team => {
      mock.team = team;
      return team;
    })
    .then(team => team.generateToken())
    .then(token => {
      mock.token = token;
      return mock;
    })
    .catch(console.log);
};    