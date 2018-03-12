'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

const User = require('../model/user/user.js');
const Profile = require('../model/user/profile.js');
const League = require('../model/league/league.js');
const Group = require('../model/league/group.js');
const SportingEvent = require('../model/sportingEvent/sportingEvent.js');

require('jest');
const url = 'http://localhost:3000';

const exampleUser = { username: 'exampleuser', password: '1234', email: 'exampleuser@test.com' };
const exampleProfile = { image: 'exampleImage', country: 'USA', state: 'WA', birthdate: 12121987, leagues: [1], groups: [2], tags: 'celebrity' };
const exampleGroup = { groupName: 'examplename', privacy: 'public', size: 2, motto: 'example motto', image: 'example image url', tags: 'washington state university' };
// owner, users
const exampleLeague = { leagueName: 'example name', scoring: 'regular', poolSize: 0, privacy: 'public', tags: 'special' };
// sportingEventID, OWNER, users
const exampleSportingEvent = { sportingEventName: '2018 march madness', desc: 'example desc', tags: '2018'};




describe('Profile Routes', function() {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Profile.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  describe('POST: /api/profile', () => {
    beforeEach( done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          exampleProfile.userID = this.tempUser._id;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });
    afterEach(done => {
      delete  exampleProfile.userID;
      done();
    });

    it('should create and return a profile', done => {
      request.post(`${url}/api/profile`)
        .send(exampleProfile)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.image).toEqual(exampleProfile.image);
          expect(res.body.country).toEqual(exampleProfile.country);
          expect(res.body.state).toEqual(exampleProfile.state);
          expect(res.body.birthdate).toEqual(exampleProfile.birthdate);
          expect(res.body.tags).toEqual(exampleProfile.tags);
          // expect(res.body.leagues).toEqual(exampleProfile.leagues);
          // expect(res.body.groups).toEqual(exampleProfile.groups);
          expect(res.body.userID).toEqual(this.tempUser._id.toString());
          done();
        });
    });

  });
});

