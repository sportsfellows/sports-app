'use strict';

const faker = require('faker');
const SportingEvent = require('../../model/sportingEvent/sportingEvent.js');
const fakeUser = require('../fakeUser.js');
const sportingEventMockFactory = module.exports = {};

sportingEventMockFactory.create = () => {
  let mock = {};
  mock.request = {
    sportingEventName: faker.internet.firstName(),
    desc: faker.random.catch_phrase_noun(),
  };

  let sportingEvent = new SportingEvent(mock.request);
  return sportingEvent.save()
    .catch(console.log);
};  

sportingEventMockFactory.createWithUser =() => {
  let mock = {};
  return fakeUser.create()
    .then(mockUser => {
      
    })
};