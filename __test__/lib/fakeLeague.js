'use strict';

const faker = require('faker');
const SportingEvent = require('../../model/sportingEvent/sportingEvent.js');

module.exports = exports = {};

exports.create = function() {
  let mock = {};
  mock.request = {
    sportingEventName: 'ncaa march madness',
    desc: faker.lorem.sentence(),
    tags: faker.random.word(),
  };


  return new SportingEvent(mock.request)
    .then(sportingEvent => sportingEvent.save())
    .then(sportingEvent => {
      mock.sportingEvent = sportingEvent;
      return mock;
    })
    .catch(console.log);
};

exports.remove = function() {
  return SportingEvent.remove({});
};



const fakeProfile = ('./fakeProfile.js');
const League= require('../../model/league.league.js');

exports.create = function() {
  let mock = {};
  mock.request = {
    legueName: faker.company.companyName(),
    scoring: 'some scoring stuff',
    poolSize: 5,
    privacy: 'public',
  };

  return new League(mock.request)
    .then(league => league.save())
    .then(league => {
      mock.league = league;
      return mock;
    });
};

exports.remove = function() {
  return League.remove({});
};