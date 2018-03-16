'use strict';

const request = require('superagent');
const fakeProfile  = require('./lib/fakeProfile.js');
const SportingEvent = require('../model/sportingEvent/sportingEvent.js');
const ScoreBoard = require('../model/league/scoreBoard.js');
const League = require('../model/league/league.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

const updatedSportingEvent = { sportingEventName: 'updated name', desc: 'updated desc', tags: 'updated tag' };
const exampleLeague = { leagueName: 'example league name', scoring: 'regular', poolSize: 0, privacy: 'private'}; 


describe('Scoreboard routes', function() {
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
        this.mock.profile = this.mock.profile._rejectionHandler0;
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
  afterEach( done => {
    Promise.all([
      fakeProfile.remove,
      SportingEvent.remove({}),
      League.remove({}),
      ScoreBoard.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });
  afterEach( () => {
    delete exampleLeague.sportingEventID;
    delete exampleLeague.owner;
  });

  it('should return a scoreboard and a 200 status', done => {
    request.get(`${url}/api/scoreboard/${this.scoreBoard._id}`)
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).toEqual(200);
        expect(res.body.userID.toString()).toEqual(this.mock.profile.userID.toString());
        expect(res.body.leagueID.toString()).toEqual(this.league._id.toString());
        expect(res.body.score).toEqual(0);
        done();
      });
  });

  it('should return a 401 when no token is provided', done => {
    request.get(`${url}/api/scoreboard/${this.scoreBoard._id}`)
      .set({
        Authorization: 'Bearer',
      })
      .end((err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });

  it('should return a 404 for a valid req with a scoreboard id not found', done => {
    request.get(`${url}/api/scoreboard/wqefgewgweg`)
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .end((err, res) => {
        expect(res.status).toEqual(404);
        done();
      });
  });

  it('should return all lists and a 200 status', done => {
    request.get(`${url}/api/scoreboards`)
      .set({
        Authorization: `Bearer ${this.mock.token}`,
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).toEqual(200);
        expect(res.status).toEqual(200);
        expect(res.body[0].userID.toString()).toEqual(this.mock.profile.userID.toString());
        expect(res.body[0].leagueID.toString()).toEqual(this.league._id.toString());
        expect(res.body[0].score).toEqual(0);
        done();
      });
  });

  it('should return a 401 when no token is provided', done => {
    request.get(`${url}/api/scoreboards`)
      .set({
        Authorization: 'Bearer',
      })
      .end((err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });
});