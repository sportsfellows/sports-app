'use strict';

const request = require('superagent');
const faker = require('faker');
const fakeTeam = require('./lib/fakeTeam.js');
const Game = require('../model/sportingEvent/game.js');
const League = require('../model/league/league.js');
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

describe('Game Routes', function () {
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
    exampleUserPick.userID
    exampleUserPick.leagueID
    exampleUserPick.gameID
    exampleUserPick.pick

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
      UserPick.remove({}),
    ])
      .then(() => done())
      .catch(done);
  });

  describe('GET: /api/games', () => {
    describe('with valid token', () => {
      it('should give 200 status', done => {
        console.log('tempGame', this.tempGame);
        request.get(`${url}/api/games`)
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
});