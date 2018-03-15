'use strict';

const faker = require('faker');
const Group = require('../../model/league/group');

module.exports = exports =  {};

exports.create = function() {
  let mock = {};
  mock.request = {
    groupName: faker.company.companyName(),
    privacy: 'public',
    motto: faker.lorem.sentence(),
  };


  return new Group(mock.request)
    .then(group => group.save())
    .then(group => {
      mock.group = group;
      return mock;
    });
};

exports.remove = function() {
  return Group.remove({});
};  
