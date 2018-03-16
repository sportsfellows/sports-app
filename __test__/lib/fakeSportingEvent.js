
'use strict';

const faker = require('faker');
const SportingEvent = require('../../model/sportingEvent/sportingEvent.js');
const sportingEventMockFactory = module.exports = {};

sportingEventMockFactory.create = () => {
  let mock = {};
  mock.request = {
    sportingEventName: faker.name.firstName(),
    desc: faker.company.catchPhraseNoun(),
  };

  let sportingEvent = new SportingEvent(mock.request);
  return sportingEvent.save()
    .catch(console.log);
};

sportingEventMockFactory.remove = () => SportingEvent.remove({});