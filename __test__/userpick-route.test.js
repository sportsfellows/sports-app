'use strict';

const request = require('superagent');
const fakeProfile = require('./lib/fakeProfile.js');
const SportingEvent = require('../model/sportingEvent/sportingEvent.js');
const Team = require('../model/sportingEvent/team.js');
const Game = require('../model/sportingEvent/game.js');
const ScoreBoard = require('../model/league/scoreBoard.js');
const League = require('../model/league/league.js');
const UserPick = require('../model/league/userPick.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

const updatedSportingEvent = { sportingEventName: 'updated name', desc: 'updated desc', tags: 'updated tag' };
const exampleLeague = { leagueName: 'example league name', scoring: 'regular', poolSize: 0, privacy: 'private'}; 

describe('UserPick routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });
  beforeEach( done => {
    return fakeProfile.create()
      .then( mock => {
        this.mock = mock;
        // this.mock.profile = this.mock.profile._rejectionHandler0;
        done();
      })
      .catch(done);
  });
  beforeEach( done => {
    return new SportingEvent(updatedSportingEvent).save()
      .then( sportingEve => {
        this.sportingEvent = sportingEve;
        done();
      })
      .catch(done);
  });
  beforeEach( done => {
    exampleLeague.sportingEventID = this.sportingEvent._id;
    exampleLeague.owner = this.mock.profile.userID;
    return new League(exampleLeague).save()
      .then( myLeague => {
        this.league = myLeague;
        done();
      })
      .catch(done);
  });
  beforeEach( done => {
    return new ScoreBoard({ userID: this.mock.profile.userID, leagueID: this.league._id }).save()
      .then( sBoard => {
        this.scoreBoard = sBoard;
        done();
      })
      .catch(done);
  });
  beforeEach( done => {
    return new Team({ teamName: 'team1', sportingEventID: this.sportingEvent._id }).save()
      .then( team1 => {
        this.team1 = team1;
        done();
      })
      .catch(done);
  });
  beforeEach( done => {
    return new Team({ teamName: 'team2', sportingEventID: this.sportingEvent._id }).save()
      .then( team2 => {
        this.team2 = team2;
        done();
      })
      .catch(done);
  });
  beforeEach( done => {
    return new Game({ sportingEventID: this.sportingEvent._id, dateTime: Date.now(), homeTeam: this.team1._id, awayTeam: this.team2._id }).save()
      .then( game => {
        this.game = game;
        done();
      })
      .catch(done);
  });
  afterEach( done => {
    Promise.all([
      fakeProfile.remove(),
      SportingEvent.remove({}),
      League.remove({}),
      ScoreBoard.remove({}),
      UserPick.remove({}),
      Team.remove({}),
      Game.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });
  afterEach( () => {
    delete exampleLeague.sportingEventID;
    delete exampleLeague.owner;
  });

  describe('POST: /api/league/:leagueId/userpick', () => {
    it('should return a scoreboard and a 200 status', done => {
      request.post(`${url}/api/league/${this.league._id}/userpick`)
        .send({ userID: this.mock.profile.userID, leagueID: this.league._id, gameID: this.game._id, pick: this.team1._id, gameTime: Date.now() })
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.userID.toString()).toEqual(this.mock.profile.userID.toString());
          expect(res.body.leagueID.toString()).toEqual(this.league._id.toString());
          expect(res.body.gameID.toString()).toEqual(this.game._id.toString());
          expect(res.body.pick.toString()).toEqual(this.team1._id.toString());
          done();
        });
    });

    it('should return 404 for route not found', done => {
      request.post(`${url}/api/league/${this.league._id}/userpi`)
        .send({ userID: this.mock.profile.userID, leagueID: this.league._id, gameID: this.game._id, pick: this.team1._id, gameTime: Date.now() })
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });

    it('should return a 401 error, no token', done => {
      request.post(`${url}/api/league/${this.league._id}/userpick`)
        .send({ userID: this.mock.profile.userID, leagueID: this.league._id, gameID: this.game._id, pick: this.team1._id, gameTime: Date.now() })
        .set({
          Authorization: `Bearer`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });

    it('should return a 400 error, no body', done => {
      request.post(`${url}/api/league/${this.league._id}/userpick`)
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

  describe('GET: /api/userpick/:userPickId && api/userpicks', () => {
    beforeEach( done => {
      return new UserPick({ userID: this.mock.profile.userID, leagueID: this.league._id, gameID: this.game._id, pick: this.team1._id, gameTime: Date.now() }).save()
        .then( userPick => {
          this.userPick = userPick;
          done();
        })
        .catch(done);
    });

    it('should return a userpick and a 200 status', done => {
      request.get(`${url}/api/userpick/${this.userPick._id}`)
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.userID.toString()).toEqual(this.mock.profile.userID.toString());
          expect(res.body.leagueID.toString()).toEqual(this.league._id.toString());
          expect(res.body.gameID.toString()).toEqual(this.game._id.toString());
          expect(res.body.pick.toString()).toEqual(this.team1._id.toString());
          done();
        });
    });

    it('should return a 401 when no token is provided', done => {
      request.get(`${url}/api/userpick/${this.userPick._id}`)
        .set({
          Authorization: `Bearer`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });

    it('should return a 404 for a valid req with a userpick id not found', done => {
      request.get(`${url}/api/userpick/ewgewgewghewh`)
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });

    it('should return all lists and a 200 status', done => {
      request.get(`${url}/api/userpicks`)
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body[0].userID.toString()).toEqual(this.mock.profile.userID.toString());
          expect(res.body[0].leagueID.toString()).toEqual(this.league._id.toString());
          expect(res.body[0].gameID.toString()).toEqual(this.game._id.toString());
          expect(res.body[0].pick.toString()).toEqual(this.team1._id.toString());
          done();
        });
    });

    it('should return a 401 when no token is provided', done => {
      request.get(`${url}/api/userpicks`)
        .set({
          Authorization: `Bearer`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });

    describe('PUT: /api/list/:listId && /api/list', () => {
      it('should update and return a userpick with a 200 status', done => {
        request.put(`${url}/api/userpick/${this.userPick._id}`)
          .send({ pick: this.team2._id})
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.userID.toString()).toEqual(this.mock.profile.userID.toString());
            expect(res.body.leagueID.toString()).toEqual(this.league._id.toString());
            expect(res.body.gameID.toString()).toEqual(this.game._id.toString());
            expect(res.body.pick.toString()).toEqual(this.team2._id.toString());
            done();
          });
      });
 
      it('should not update and return a 401 status', done => {
        request.put(`${url}/api/userpick/${this.userPick._id}`)
          .send({ pick: this.team2._id})
          .set({
            Authorization: `Bearer `,
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
 
      it('should not update and return a 404 status for userpick not found', done => {
        request.put(`${url}/api/userpick/wegegewgw`)
          .send({ pick: this.team2._id})
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
