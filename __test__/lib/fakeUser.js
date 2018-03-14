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
  console.log(user);

  return user.generatePasswordHash(mock.request.user)
    .then(user => {
      mock.user = user;
      return user.password();

      //     return Company.create(mock.request.companyName, mock.request.password, mock.request.email, mock.request.phoneNumber, mock.request.website)
      //       .then(company => {
      //         mock.company = company;
      //         return company.createToken();
      //       })
      //       .then(token => {
      //         mock.token = token;
      //         return Company.findById(mock.company._id);
      //       })
      //       .then(company => {
      //         mock.company = company;
      //         return mock;
      //       })
      //       .catch(console.log);
      //   };

      // companyMockFactory.remove = () => Company.remove({});
     
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

