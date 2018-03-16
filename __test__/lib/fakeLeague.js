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

  // let user = new User(mock.requestUser);
  // return user.generatePasswordHash(mock.requestUser.password)
  //   .then(user => user.save())
  return sportingEventMockFactory.create()
    .then( se => se.save())
    .then(sportingEvent => {
      mock.sportingEvent = sportingEvent;
      mock.leagueRequest.sportingEventID = sportingEvent._id;
      
      return fakeUser.create();
    })
    .then(mockObject => {
      mock.token = mockObject.token;
      console.log(mock.token);
      mock.user = mockObject.user;
      mock.leagueRequest.owner = mockObject.user._id;

      return new League(mock.leagueRequest).save();
    })
    .then(league => {
      mock.league = league;
      return mock;
    });
};

leagueMockFactory.remove = () => Promise.all([
  League.remove({}),
  sportingEventMockFactory.remove({}),
  fakeUser.remove(),
]);
