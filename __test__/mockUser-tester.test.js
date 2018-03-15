// 'use strict';

// const userMockFactory = require('./lib/fakeUser.js');
// const debug = require('debug')('sportsapp:mockUser-tester.test.js');
// const serverToggle = require('../lib/server-toggle.js');
// const server = require('../server.js');

// require('jest');
// describe('testing UserMockFactory routes', function() {
//   beforeAll( done => {
//     serverToggle.serverOn(server, done);
//   });
//   afterAll( done => {
//     serverToggle.serverOff(server, done);
//   });
//   describe('Test file Helper Module', function() {
//     describe('testing the data', function() {
//       it.only('just testing the data', function(done) {
//         let result = userMockFactory.create();
//         debug('results: ', result);  
//         console.log('results: ', result); 
//         expect(result).toEqual(result);   
//         done();
//       });
//     });
//   });
// });