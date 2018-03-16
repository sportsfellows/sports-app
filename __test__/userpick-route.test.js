'use strict';

const request = require('superagent');
const faker = require('faker');
const fakeTeam = require('./lib/fakeTeam.js');
const Game = require('../model/sportingEvent/game.js');
const Team = require('../model/sportingEvent/team.js');
const League = require('../model/league/league.js');
const Profile = require('../model/user/profile.js');
const User = require('../model/user/user.js');
const UserPick = require('../model/league/userPick.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

let exampleGame = {
  groupName: faker.company.companyName(),
  privacy: 'public',
  dateTime: faker.date.future(),
};

let exampleLeague = {
  leagueName: faker.company.companyName(),
  scoring: 'something 1',
  poolSize: 7,
  privacy: 'public',
};

let exampleUserPick = {
  gameTime: faker.date.future(),
};

describe('User Pick Routes', function () {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });

  beforeEach(() => {
    return fakeTeam.create()
      .then(mock => {
        this.homeMock = mock;
      });
  });

  beforeEach(() => {
    return fakeTeam.create()
      .then(mock => {
        this.awayMock = mock;
      });
  });

  beforeEach(done => {
    exampleGame.homeTeam = this.homeMock.team._id;
    exampleGame.awayTeam = this.awayMock.team._id;
    exampleGame.sportingEventID = this.homeMock.sportingEvent._id;

    new Game(exampleGame).save()
      .then(game => {
        this.tempGame = game;
        done();
      })
      .catch(done);
  });

  beforeEach(done => {
    exampleLeague.owner = this.homeMock.user._id;
    exampleLeague.sportingEventID = this.homeMock.sportingEvent._id;

    new League(exampleLeague).save()
      .then(game => {
        this.tempLeague = game;
        done();
      })
      .catch(done);
  });

  beforeEach(done => {
    exampleUserPick.userID = this.homeMock.team._id;
    exampleUserPick.leagueID = this.tempLeague._id;
    exampleUserPick.gameID = this.tempGame._id;
    exampleUserPick.pick = this.homeMock.team._id;

    new UserPick(exampleUserPick).save()
      .then(userPick => {
        this.tempUserPick = userPick;
        done();
      })
      .catch(done);
  });

  afterEach(done => {
    Promise.all([
      fakeTeam.remove,
      Game.remove({}),
      Team.remove({}),
      League.remove({}),
      Profile.remove({}),
      User.remove({}),
    ])
      .then(() => done())
      .catch(done);
  });

  describe('GET: /api/userpick/:userPickId', () => {
    describe('with valid token', () => {
      it('should give 200 status', done => {
        console.log('tempUserPick', this.tempUserPick);
        request.get(`${url}/api/userpick/${this.tempUserPick._id}`)
          .set({
            Authorization: `Bearer ${this.homeMock.token}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
  });

  describe('POST: /api/league/:leagueId/userpick', () => {
    describe('with body and valid token', () => {
      it('should give 200 status', done => {
        console.log('tempUserPick', this.tempUserPick);
        request.post(`${url}/api/userpicks`)
          .set({
            Authorization: `Bearer ${this.homeMock.token}`,
          })
          .send(exampleUserPick)
          .end((err, res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
  });

  // describe('GET: /api/game/:gameId', () => {
  //   describe('with valid id and token', () => {
  //     it('should give 200 status', done => {
  //       request.get(`${url}/api/game/${this.tempGame._id}`)
  //         .set({
  //           Authorization: `Bearer ${this.homeMock.token}`,
  //         })
  //         .end((err, res) => {
  //           expect(res.status).toEqual(200);
  //           expect(res.body.homeTeam).toEqual(this.homeMock.team._id.toString());
  //           expect(res.body.awayTeam).toEqual(this.awayMock.team._id.toString());
  //           done();
  //         });
  //     });
  //   });

  //   describe('with valid id and no token', () => {
  //     it('should give 401 status', done => {
  //       request.get(`${url}/api/game/${this.tempGame._id}`)
  //         .set({
  //           Authorization: `Bearer `,
  //         })
  //         .end((err, res) => {
  //           expect(res.status).toEqual(401);
  //           done();
  //         });
  //     });
  //   });

  //   describe('with valid id and no token', () => {
  //     it('should give 404 status', done => {
  //       request.get(`${url}/api/game/123456`)
  //         .set({
  //           Authorization: `Bearer ${this.homeMock.token}`,
  //         })
  //         .end((err, res) => {
  //           expect(res.status).toEqual(404);
  //           done();
  //         });
  //     });
  //   });
  // });

  // describe('POST: /api/game', () => {
  //   describe('with valid token and body', () => {
  //     it('should return 200 status', done => {
  //       request.post(`${url}/api/sportingevent/${this.homeMock.sportingEvent._id}/game`)
  //         .set({
  //           Authorization: `Bearer ${this.homeMock.token}`,
  //         })
  //         .send(exampleGame)
  //         .end((err, res) => {
  //           expect(res.status).toEqual(200);
  //           done();
  //         });
  //     });
  //   });

  //   describe('with no token and valid body', () => {
  //     it('should return 401 status', done => {
  //       request.post(`${url}/api/sportingevent/${this.homeMock.sportingEvent._id}/game`)
  //         .set({
  //           Authorization: `Bearer `,
  //         })
  //         .send(exampleGame)
  //         .end((err, res) => {
  //           expect(res.status).toEqual(401);
  //           done();
  //         });
  //     });
  //   });

  //   describe('with valid token and no body', () => {
  //     it('should return 200 status', done => {
  //       request.post(`${url}/api/sportingevent/${this.homeMock.sportingEvent._id}/game`)
  //         .set({
  //           Authorization: `Bearer ${this.homeMock.token}`,
  //         })
  //         .end((err, res) => {
  //           expect(res.status).toEqual(400);
  //           done();
  //         });
  //     });
  //   });
  // });

  // describe('PUT: /api/game/:gameId', () => {
  //   describe('with valid body and token', () => {
  //     it('should give 200 status', done => {
  //       request.put(`${url}/api/game/${this.tempGame._id}`)
  //         .set({
  //           Authorization: `Bearer ${this.homeMock.token}`,
  //         })
  //         .send({status: 'ended'})
  //         .end((err, res) => {
  //           expect(res.status).toEqual(200);
  //           done();
  //         });
  //     });
  //   });

  //   describe('with valid body and no token', () => {
  //     it('should give 401 status', done => {
  //       request.put(`${url}/api/game/${this.tempGame._id}`)
  //         .set({
  //           Authorization: `Bearer `,
  //         })
  //         .send({status: 'ended'})
  //         .end((err, res) => {
  //           expect(res.status).toEqual(401);
  //           done();
  //         });
  //     });
  //   });

  //   describe('with invalid id and token', () => {
  //     it('should give 404 status', done => {
  //       request.put(`${url}/api/game/123456`)
  //         .set({
  //           Authorization: `Bearer ${this.homeMock.token}`,
  //         })
  //         .send({status: 'ended'})
  //         .end((err, res) => {
  //           expect(res.status).toEqual(404);
  //           done();
  //         });
  //     });
  //   });
  // });


});