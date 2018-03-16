'use strict';

const faker = require('faker');
const User = require('../../model/user/user.js');
const Profile = require('../../model/user/profile.js');

module.exports = exports = {};

exports.create = function() {
  let mock = {};

  mock.requestUser = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  mock.requestProfile = {
    image: faker.random.image(),
    country: faker.address.country(),
    state: faker.address.state(),
    birthdate: 10101909,
    tags: faker.random.word(),
  };

  let user = new User(mock.requestUser);
  return user.generatePasswordHash(mock.requestUser.password)
    .then( user => user.save())
    .then( user => {
      mock.requestProfile.userID = user._id;
      mock.requestProfile.username = user.username;
      let profile = new Profile(mock.requestProfile).save();
      mock.profile = profile;
      
      return user;
    })
    .then( user => {
      mock.user = user;
      return user;
    })
    .then( user => user.generateToken())
    .then( token => {
      mock.token = token;
      return mock;    
    })
    .catch(console.log);
};    
      
exports.remove = function() {
  User.remove({});
  return Profile.remove({});
};