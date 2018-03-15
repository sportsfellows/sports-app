// 'use strict';

// const request = require('superagent');
// const Team = require('../model/sportingEvent/team.js');
// const serverToggle = require('../lib/server-toggle.js');
// const server = require('../server.js');

// require('jest');

// const url = 'http://localhost:3000';

// const exampleTeam = {
//   teamName: 'example team name',
//   content: 'example content',
// };

// describe('Team Router', function() {
//   beforeAll( done => {
//     serverToggle.serverOn(server, done);
//   });
//   afterAll( done => {
//     serverToggle.serverOff(server, done);
//   });

//   describe('GET: /api/team/:teamId', function() {
//     // describe('with a valid id', function() {
//     //   beforeEach( done => {
//     //     Team.createTeam(exampleTeam)
//     //       .then( team => {
//     //         this.tempTeam = team;
//     //         done();
//     //       })
//     //       .catch( err => done(err));
//     //   });
//     // });

//     // describe('DELETE: /api/team/:teamId', () => {
//     //   describe('with teamId deleted', () => {
//     //     beforeEach( done => {
//     //       if (this.createTeam) {
//     //         Team.createTeam(exampleTeam)
//     //           .then( team => {
//     //             this.tempTeam = team;
//     //             done();
//     //           })
//     //           .catch( err => done(err));
//     //       }
//     //     });

//     //     afterAll( done => {
//     //       Team.deleteTeam(this.tempTeam.id)
//     //         .then( () => done())
//     //         .catch( err => done(err));
//     //     });

//     //     it('should return teamId deleted', done => {
//     //       request.delete(`${url}/api/team/${this.tempTeam.id}`)
//     //         .end((err, res) => {
//     //           if (err) return done(err);
//     //           expect(res.status).toEqual(204);
//     //           expect(res.body.id).toEqual(null);
//     //           expect(res.body.name).toEqual(null);
//     //           expect(res.body.content).toEqual(null);
//     //           done();
//     //         });
//     //     });
//     //   });
//     // });
//   });
// });