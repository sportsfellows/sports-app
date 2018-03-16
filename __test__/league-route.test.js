'use strict';

const request = require('superagent');
const faker = require('faker');
const fakeTeam = require('./lib/fakeTeam.js');
const League = require('../model/league/league.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

let exampleLeague = {
  leagueName: faker.company.companyName(),
  scoring: 'something 1',
  poolSize: 7,
  privacy: 'public',
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

  afterEach(done => {
    Promise.all([
      fakeTeam.remove,
      League.remove({}),
    ])
      .then(() => done())
      .catch(done);
  });

  describe('GET: /api/leagues', () => {
    describe('with valid token', () => {
      it('should give 200 status', done => {
        console.log('homeMock', this.homeMock);
        request.get(`${url}/api/leagues`)
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

  // describe('GET: /api/game/:gameId', () => {
  //   describe('with valid id and token', () => {
  //     it('should give 200 status', done => {
  //       request.get(`${url}/api/game/${this.tempLeague._id}`)
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
  //       request.get(`${url}/api/game/${this.tempLeague._id}`)
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
  //       request.put(`${url}/api/game/${this.tempLeague._id}`)
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
  //       request.put(`${url}/api/game/${this.tempLeague._id}`)
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