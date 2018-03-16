'use strict';

const faker = require('faker');
const League = require('../../model/league/league.js');
const sportingEventMockFactory = require('./fakeSportingEvent.js');
const fakeUser = require('./fakeUser.js');


const leagueMockFactory = module.exports = exports = {};

leagueMockFactory.create = function() {
  let mock = {};
  mock.leagueRequest = {
    leagueName: faker.company.companyName(),
    scoring: 'some scoring stuff',
    poolSize: faker.random.number(),
    privacy: 'public',
  };


  return sportingEventMockFactory.create()
    .then(sportingEvent => {
      mock.sportingEvent = sportingEvent;
      mock.leagueRequest.sportingEventID = sportingEvent.ID;
      
      return fakeUser.create();
    })
    .then(mockObject => {
      mock.token = mockObject.token;
      mock.user = mockObject.user;
      mock.leagueRequest.owner = mockObject.user._id;

      return new League(mock.leagueRequest).save();
    })
    .then(league => {
      mock.league = league;
      console.log(mock);
      return mock;
    });
};

leagueMockFactory.remove = () => Promise.all([
  League.remove({}),
  sportingEventMockFactory.remove(),
  fakeUser.remove(),
]);
