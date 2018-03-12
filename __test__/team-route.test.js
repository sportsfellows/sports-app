'use strict';

const request = require('superagent');
const Team = require('../model/sportingEvent/team.js');
const url = 'http://localhost:3000';

require('jest');
require('../server.js');

const exampleTeam = {
  teamName: 'example team name',
  content: 'example content',
};

describe('Team Router', function() {
  describe('GET: /api/team', function() {
    describe('with a valid id', function() {
      beforeEach( done => {
        Team.createTeam(exampleTeam)
          .then( team => {
            this.tempTeam = team;
            done();
          });
          .catch( err => done(err))
      });

      afterAll( done => {
        Team.deleteTeam(this.tempTeam.id)
        .then( () => done())
        .catch( err => done(err))
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
        it('should respond with a 4')
      })
    });
  });
});