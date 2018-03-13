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

describe('Team Router', () => {
  describe('POST: /api/team', () => {
    describe('with a valid body teamName and sportingEventID', () => {
      afterEach( done => {
        if (this.tempTeam) {
          Team.tempTeam(this.tempTeam.id)
            .then( () => done())
            .catch( err => done(err));
        }
      });

      it('should return a team', done => {
        request.post(`${url}/api/team`)
          .send(exampleTeam)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(400);
            expect(res.body.name).toEqual(exampleTeam.name);
            expect(res.body.content).toEqual(exampleTeam.content);
            this.tempTeam = res.body;
            done();
          });
      });
    });

    describe('DELETE: /api/team/:teamId', () => {
      describe('with teamId deleted', () => {
        beforeEach( done => {
          if (this.createTeam) {
            Team.createTeam(exampleTeam)
              .then( team => {
                this.tempTeam = team;
                done();
              })
              .catch( err => done(err));
          }
        });

        afterAll( done => {
          Team.deleteTeam(this.tempTeam.id)
            .then( () => done())
            .catch( err => done(err));
        });

        it('should return teamId deleted', done => {
          request.delete(`${url}/api/team/${this.tempTeam.id}`)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.status).toEqual(204);
              expect(res.body.id).toEqual(null);
              expect(res.body.name).toEqual(null);
              expect(res.body.content).toEqual(null);
              done();
            });
        });
      });
    });
  });
});