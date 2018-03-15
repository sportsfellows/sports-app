'use strict';

const faker = require('faker');
const Team = require('../../model/sportingEvent/team.js');
const teamMockFactory = module.exports = {};

teamMockFactory.create = () => {
  let mock = {};
  mock.request = {
    teamName: faker.internet.firstName(),
  };

  return new Team(mock.request)
    .then(team => team.save())
    .then(team => {
      mock.team = team;
      return mock;
    })
    .catch(console.log);
};

teamMockFactory.remove = () => Team.remove({});