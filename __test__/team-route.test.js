'use strict';

const request = require('superagent');
const Team = require('../model/sportingEvent/team.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

const exampleTeam = {
  teamName: 'example team name',
  content: 'example content',
};

describe('Team Router', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  describe('GET: /api/team/:teamId', function() {
    describe('with a valid id', function() {
      beforeEach( done => {
        Team.createTeam(exampleTeam)
          .then( team => {
            this.tempTeam = team;
            done();
          })
          .catch( err => done(err));
      });

      afterAll( done => {
        Team.deleteTeam(this.tempTeam.id)
          .then( () => done())
          .catch( err => done(err));
      });

      it('should return a team', done => {
        request.get(`${url}/api/team/${this.tempTeam.id}`)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.id).toEqual(this.tempTeam.id);
            expect(res.body.name).toEqual(this.tempTeam.name);
            expect(res.body.content).toEqual(this.tempTeam.content);
            done();
          });
      });

      describe('with an invalid id', function() {
        it('should respond with a 4');
      });
    });
  });
});