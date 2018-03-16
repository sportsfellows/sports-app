
'use strict';

const faker = require('faker');
const SportingEvent = require('../../model/sportingEvent/sportingEvent.js');
const sportingEventMockFactory = module.exports = {};

sportingEventMockFactory.create = () => {
  let mock = {};
  mock.request = {

    sportingEventName: faker.random.word(),
    desc: faker.random.word(),
  };

  return new SportingEvent(mock.request).save()
    .then(sportingEvent => {
      mock.sportingEvent = sportingEvent;
      mock.request.SportingEventID = sportingEvent._id;
      return mock;
    })
    .catch(console.log);
};

sportingEventMockFactory.remove = function() {
  return SportingEvent.remove({});
};
 


