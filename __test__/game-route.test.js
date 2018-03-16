'use strict';

const request = require('superagent');
const faker = require('faker');
const Game = require('../model/sportingEvent/game.js');
const Team = require('../model/sportingEvent/team.js');
const League = require('../model/league/league.js');
const SportingEvent = require('../model/sportingEvent/sportingEvent.js');
const Profile = require('../model/user/profile.js');
const User = require('../model/user/user.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

let exampleUser = {
  username: faker.random.word(),
  password: faker.random.word(),
  email: faker.internet.email(),
};

let exampleProfile = {
  image: faker.random.image(),
  country: faker.address.country(),
  state: faker.address.state(),
  birthdate: 10101909,
  tags: faker.random.word(),
};

let exampleSportingEvent = {
  sportingEventName: faker.random.word(),
  desc: faker.random.word(),
};

let exampleLeague = {
  leagueName: faker.company.companyName(),
  scoring: 'something 1',
  poolSize: 7,
  privacy: 'public',
};

let homeTeam = {
  teamName: faker.name.firstName(),
  seed: faker.random.number(),
  pretournamentRecord: faker.random.number() + ' - ' + faker.random.number(),
};

let awayTeam = {
  teamName: faker.name.firstName(),
  seed: faker.random.number(),
  pretournamentRecord: faker.random.number() + ' - ' + faker.random.number(),
};

let exampleGame = {
  groupName: faker.company.companyName(),
  privacy: 'public',
  dateTime: faker.date.future(),
};

describe('Game Routes', function () {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });

  beforeEach(done => {
    let user = new User(exampleUser);
    return user.generatePasswordHash(user.password)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        console.log('temp user', this.tempUser);
        return user.generateToken();
      })
      .catch(done);
  });

  beforeEach(done => {
    request.get(`${url}/api/signin`)
      .auth(exampleUser.username, exampleUser.password)
      .end((err, res) => {
        console.log('res body', res.body);
        done();
      });
  });

  beforeEach(done => {
    exampleProfile.userID = this.tempUser._id;
    exampleProfile.username = this.tempUser.username;

    new Profile(exampleProfile).save()
      .then(profile => {
        this.tempProfile = profile;
        console.log('temp profile', this.tempProfile);
        done();
      })
      .catch(done);
  });

  beforeEach(done => {
    new SportingEvent(exampleSportingEvent).save()
      .then(sportingEvent => {
        this.tempSportingEvent = sportingEvent;
        console.log('temp sporting event', this.tempSportingEvent);
        done();
      })
      .catch(done);
  });

  beforeEach(done => {
    exampleLeague.owner = this.tempProfile.userID;
    exampleLeague.sportingEventID = this.tempSportingEvent._id;

    new League(exampleLeague).save()
      .then(league => {
        this.tempLeague = league;
        console.log('temp league', this.tempLeague);
        done();
      })
      .catch(done);
  });

  beforeEach(done => {
    homeTeam.sportingEventID = this.tempSportingEvent._id;

    new Team(homeTeam).save()
      .then(homeTeam => {
        this.tempHomeTeam = homeTeam;
        console.log('temp home team', this.tempHomeTeam);
        done();
      })
      .catch(done);


  });

  beforeEach(done => {
    awayTeam.sportingEventID = this.tempSportingEvent._id;

    new Team(awayTeam).save()
      .then(awayTeam => {
        this.tempAwayTeam = awayTeam;
        console.log('temp away team', this.tempAwayTeam);
        done();
      })
      .catch(done);
  });

  beforeEach(done => {
    exampleGame.homeTeam = this.tempHomeTeam._id;
    exampleGame.awayTeam = this.tempAwayTeam._id;
    exampleGame.sportingEventID = this.tempSportingEvent._id;

    new Game(exampleGame).save()
      .then(game => {
        this.tempGame = game;
        console.log('temp game', this.tempGame);
        done();
      })
      .catch(done);
  });

  afterEach(done => {
    Promise.all([
      Game.remove({}),
      Team.remove({}),
      League.remove({}),
      Profile.remove({}),
      User.remove({}),
    ])
      .then(() => done())
      .catch(done);
  });

  describe('GET: /api/games', () => {
    describe('with valid token', () => {
      it('should give 200 status', done => {
        request.get(`${url}/api/games`)
          .set({
            Authorization: `Bearer ${this.tempProfile.token}`,
          })
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
  //         .send({ status: 'ended' })
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
  //         .send({ status: 'ended' })
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
  //         .send({ status: 'ended' })
  //         .end((err, res) => {
  //           expect(res.status).toEqual(404);
  //           done();
  //         });
  //     });
  //   });
  // });


});