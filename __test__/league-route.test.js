'use strict';

const request = require('superagent');
const faker = require('faker');
const League = require('../model/league/league.js');
const SportingEvent = require('../model/sportingEvent/sportingEvent.js');
const fakeProfile = require('./lib/fakeProfile.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

const exampleLeague = {
  leagueName: faker.company.companyName(),
  scoring: 'some scoring',
  poolSize: faker.random.number(),
  privacy: 'public',
};

const updatedSportingEvent = {
  sportingEventName: 'updated name',
  desc: 'updated desc',
  tags: 'updated tag',
};



describe('League routes', function () {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });

  beforeEach(done => {
    return fakeProfile.create()
      .then(mock => {
        this.mock = mock;
        this.mock.profile = this.mock.profile._rejectionHandler0;
        done();
      })
      .catch(done);
  });
  beforeEach(done => {
    return new SportingEvent(updatedSportingEvent).save()
      .then(sportingEve => {
        this.sportingEvent = sportingEve;
        done();
      })
      .catch(done);
  });
  beforeEach(done => {
    exampleLeague.sportingEventID = this.sportingEvent._id;
    exampleLeague.owner = this.mock.profile.userID;
    return new League(exampleLeague).save()
      .then(myLeague => {
        this.league = myLeague;
        done();
      })
      .catch(done);
  });
  afterEach(done => {
    Promise.all([
      fakeProfile.remove,
      SportingEvent.remove({}),
      League.remove({}),
    ])
      .then(() => done())
      .catch(done);
  });
  afterEach(() => {
    delete exampleLeague.sportingEventID;
    delete exampleLeague.owner;
  });
  describe('POST: /api/sportingevent/sportingeventId/league', () => {
    describe('with a valid body and token', () => {
      it('should post and return a league', done => {
        request.post(`${url}/api/sportingevent/${this.league.sportingEventID}/league`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .send(exampleLeague)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.leagueName).toEqual(exampleLeague.leagueName);
            expect(res.body.scoring).toEqual('some scoring');
            expect(res.body.poolSize).toEqual(exampleLeague.poolSize);
            expect(res.body.privacy).toEqual(exampleLeague.privacy);
            done();
          });
      });
    });
    describe('with a bad body', () => {
      it('should send a 400 error', done => {
        request.post(`${url}/api/sportingevent/${this.league.sportingEventID}/league`)
          .send()
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
    describe('with valid body and no token', () => {
      it('should give 401 status', done => {
        request.post(`${url}/api/sportingevent/${this.league.sportingEventID}/league`)
          .set({
            Authorization: `Bearer `,
          })
          .send(exampleLeague)
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
    });
  });
  describe('PUT: /api/league/leagueID/adduser', () => {
    describe('with a valid body and id', () => {
      it('should give us a 200 status', done => {
        request.put(`${url}/api/league/${this.league.id}/adduser`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .send(exampleLeague)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
  });
  describe('with an invalid id', () => {
    it('should give 404 status', done => {
      request.put(`${url}/api/league/badid/adduser`)
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })

        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
  });
  describe('with no token', () => {
    it('should give 401 status', done => {
      request.put(`${url}/api/league/${this.league.id}/adduser`)
        .set({
          Authorization: `Bearer `,
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });
  });
  describe('PUT: /api/group/:groupId/removeuser', () => {
    describe('with valid id and token', () => {
      it('should give 200 status', done => {
        request.put(`${url}/api/league/${this.league.id}/removeuser`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
  });
  describe('with an invalid id', () => {
    it('should give 404 status', done => {
      request.put(`${url}/api/league/badid`)
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })

        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
  });
  describe('with no token', () => {
    it('should give 401 status', done => {
      request.put(`${url}/api/league/${this.league.id}/removeuser`)
        .set({
          Authorization: `Bearer `,
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });
  });
  describe('PUT: /api/league/:groupId', () => {
    describe('with valid body and token', () => {
      it('should give 200 status', done => {
        request.put(`${url}/api/league/${this.league.id}`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .send({ leagueName: 'new league name' })
          .end((err, res) => {
            expect(res.status).toEqual(200);
            expect(res.body.leagueName).toEqual('new league name');
            done();
          });
      });
    });
  });
  describe('with valid body and no token', () => {
    it('should give 401 status', done => {
      request.put(`${url}/api/league/${this.league._id}`)
        .set({
          Authorization: `Bearer `,
        })
        .send({ leagueName: 'new league name' })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });
  });
  describe('with no body and valid token', () => {
    it('should give 404 status', done => {
      request.put(`${url}/api/league/badid`)
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })

        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
  });
  describe('DELETE: /api/league/:leagueId', () => {
    describe('with valid token', () => {
      it('should give 204 status', done => {
        request.delete(`${url}/api/league/${this.league._id}`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(204);
            done();
          });
      });
    });

    describe('with no token', () => {
      it('should give 401 status', done => {
        request.delete(`${url}/api/league/${this.league._id}`)
          .set({
            Authorization: `Bearer `,
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
    });

    describe('with invalid id', () => {
      it('should give 404 status', done => {
        request.delete(`${url}/api/league/123456`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });
    });
  });

});

