'use strict';

const request = require('superagent');
const fakeProfile  = require('./lib/fakeProfile.js');
const SportingEvent = require('../model/sportingEvent/sportingEvent.js');
const ScoreBoard = require('../model/league/scoreBoard.js');
const League = require('../model/league/league.js');
const MessageBoard = require('../model/league/messageBoard.js');
const Comment = require('../model/league/comment.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

// Review: Why not use the mockData library you made?
const updatedSportingEvent = { sportingEventName: 'updated name', desc: 'updated desc', tags: 'updated tag' };
const exampleLeague = { leagueName: 'example league name', scoring: 'regular', poolSize: 0, privacy: 'private'}; 
// const exampleSportingEvent = { sportingEventName: 'example name', desc: 'example desc', tags: 'example tag' };
// const exampleSportingEvent2 = { desc: 'example desc', tags: 'example tag' };

describe('Comment routes', function() {
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
    return new MessageBoard({ leagueID: this.league._id }).save()
      .then( mBoard => {
        this.messageBoard = mBoard;
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
      MessageBoard.remove({}),
      Comment.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });
  afterEach( () => {
    delete exampleLeague.sportingEventID;
    delete exampleLeague.owner;
  });

  describe('POST: /api/messageboard/:messageBoardId/comment', () => {
    it('should return a scoreboard and a 200 status', done => {
      request.post(`${url}/api/messageboard/${this.messageBoard._id}/comment`)
        .send({ userID: this.mock.profile.userID, messageBoardID: this.messageBoard._id, content: 'example content' })
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.userID.toString()).toEqual(this.mock.profile.userID.toString());
          expect(res.body.messageBoardID.toString()).toEqual(this.messageBoard._id.toString());
          expect(res.body.content).toEqual('example content');
          done();
        });
    });

    it('should return 404 for route not found', done => {
      request.post(`${url}/api/messageboard/${this.messageBoard._id}/com`)
        .send({ userID: this.mock.profile.userID, messageBoardID: this.messageBoard._id, content: 'example content' })
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });

    it('should return a 401 error, no token', done => {
      request.post(`${url}/api/messageboard/${this.messageBoard._id}/comment`)
        .send({ userID: this.mock.profile.userID, messageBoardID: this.messageBoard._id, content: 'example content' })
        .set({
          Authorization: `Bearer`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });

    it('should return a 400 error, no body', done => {
      request.post(`${url}/api/messageboard/${this.messageBoard._id}/comment`)
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

  describe('GET: /api/comment/:commentId && api/comments', () => {
    beforeEach( done => {
      return new Comment({ userID: this.mock.profile.userID, messageBoardID: this.messageBoard._id, content: 'example content' }).save()
        .then( commentz => {
          this.comment = commentz;
          done();
        })
        .catch(done);
    });

    it('should return a comment and a 200 status', done => {
      request.get(`${url}/api/comment/${this.comment._id}`)
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.userID.toString()).toEqual(this.mock.profile.userID.toString());
          expect(res.body.messageBoardID.toString()).toEqual(this.messageBoard._id.toString());
          expect(res.body.content).toEqual('example content');
          done();
        });
    });

    it('should return a 401 when no token is provided', done => {
      request.get(`${url}/api/comment/${this.comment._id}`)
        .set({
          Authorization: `Bearer`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });

    it('should return a 404 for a valid req with a comment id not found', done => {
      request.get(`${url}/api/comment/erghreh`)
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });

    it('should return all lists and a 200 status', done => {
      request.get(`${url}/api/comments`)
        .set({
          Authorization: `Bearer ${this.mock.token}`,
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body[0].userID.toString()).toEqual(this.mock.profile.userID.toString());
          expect(res.body[0].messageBoardID.toString()).toEqual(this.messageBoard._id.toString());
          expect(res.body[0].content).toEqual('example content');
          done();
        });
    });

    it('should return a 401 when no token is provided', done => {
      request.get(`${url}/api/comments`)
        .set({
          Authorization: 'Bearer',
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });
  });
});
