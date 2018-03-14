'use strict';

const request = require('superagent');
const User = require('../model/user/user.js');
const Profile = require('../model/user/profile.js');
const Group = require('../model/league/group.js');
const MessageBoard = require('../model/league/messageBoard.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

const {exampleUser, exampleProfile, exampleTeam, exampleSportingEvent, exampleGame, exampleLeague, exampleGroup, exampleComment} = require('./lib/mock-data.js'); // eslint-disable-line

describe('Message Board Routes', function() {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });

  beforeEach(done => {
    new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        exampleProfile.userID = this.tempUser._id;
        return user.generateToken();
      })
      .then(token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
  });

  beforeEach(done => {
    exampleGroup.owner = this.tempUser._id;
    exampleGroup.users.push(this.tempUser._id);
    new Group(exampleGroup).save()
      .then(group => {
        this.tempGroup = group;
        done();
      })
      .catch(done);
  });

  beforeEach(done => {
    MessageBoard.findOne({ groupID: this.tempGroup._id})
      .then(messageBoard => {
        this.tempMessageBoard = messageBoard;
      })
      .catch(done);
  });

  afterAll(done => {
    serverToggle.serverOff(server, done);
  });

  afterEach(done => {
    Promise.all([
      User.remove({}),
      Profile.remove({}),
      Group.remove({}),
    ])
      .then(() => done())
      .catch(done);
  });

  describe('GET: /api/messageboard/:messageBoardId', () => {
    describe('with valid messageBoardId', () => {
      it('should give 200 response code', done => {
        request.get(`${url}/api/messageboard/${this.tempMessageBoard._id}`)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
  });
});