const faker = require('faker');
const League = require('../../model/league.league.js');

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