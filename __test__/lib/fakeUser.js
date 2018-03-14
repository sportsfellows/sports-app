'use strict';

const faker = require('faker');
const User = require('../../model/user/user.js');
const userMockFactory = module.exports = {};

userMockFactory.create = () => {
  let mock = {};
  mock.request = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const user = new User(mock.request);
  console.log(user)
  return user.generatePasswordHash(mock.user.password);

    .then(user => {
      mock.user = user;
     
    })
    .then(user => user.save())
    .then((user ) => user.generateToken())
    .then(token => {
      mock.token = token;
      return User.findById(mock.user._id);
    })
    .then(user => {
      mock.user = user;
      return mock;
    });
};

