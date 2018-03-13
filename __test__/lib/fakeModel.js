'use strict';

const faker = require('faker');

let exampleUser = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

let exampleProfile = {
  image: faker.random.image(),
  country: faker.address.country(),
  state: faker.address.state(),
  birthdate: 10101908,
};

let exampleTeam = {
  teamName: faker.random.word(),
  seed: faker.radndom.number(),
  pretournamentRecord: '20-10',
  tags: 'pac-12',
};

let exampleSportingEvent = {
  sportingEventName: 'ncaa march madness',
  desc: '2018',
  tags: 'were good',
};

let exampleGame = {
  dateTime: faker.date.future(),
};

let exampleLeague = {
  leagueName: faker.random.word(),
  scoring: 'standard',
  poolSize: faker.random.number(),
  privacy: 'yes',
  password: faker.internet.password(),

};

let exampleGroup = {
  groupName: faker.random.word(),
  privacy: 'yes',
  motto: faker.lorem.sentence(),
  image: faker.random.image(),
  password: faker.internet.password(),
};

let exampleComment = {
  content: faker.lorem.sentence(),

};

module.exports = {
  'exampleUser': exampleUser,
  'exampleProfile': exampleProfile,
  'exampleTeam': exampleTeam,
  'exampleSportingEvent': exampleSportingEvent,
  'exampleGame': exampleGame,
  'exampleLeague': exampleLeague,
  'exampleGroup': exampleGroup,
  'exampleComment': exampleComment,
};