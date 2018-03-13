'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

const User = require('../model/user/user.js');
const Profile = require('../model/user/profile.js');
const Group = require('../model/league/group.js');

require('jest');
const url = 'http://localhost:3000';

const exampleUser = { username: 'exampleuser', password: '1234', email: 'exampleuser@test.com' };
const exampleProfile = { image: 'exampleImage', country: 'USA', state: 'WA', birthdate: 12121987, tags: 'celebrity', leagues: [], groups: [] };
const exampleGroup = { groupName: 'examplename', privacy: 'public', size: 2, motto: 'example motto', image: 'example image url', tags: 'washington state university', users: [] };

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
          .auth('something needs to be here') // need to fix this
          .end((err, res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
  });
});