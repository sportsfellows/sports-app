'use strict';

const request = require('superagent');
const faker = require('faker');
const fakeProfile = require('./lib/fakeProfile.js');
const Group = require('../model/league/group.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = 'http://localhost:3000';

let exampleGroup = {
  groupName: faker.company.companyName(),
  privacy: 'public',
};

describe('Message Board Routes', function () {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });

  beforeEach(() => {
    return fakeProfile.create()
      .then(mock => {
        this.mock = mock;
        return this.mock.profile = this.mock.profile._rejectionHandler0;
      });
  });

  beforeEach(done => {
    exampleGroup.owner = this.mock.profile._id;
    exampleGroup.users = [this.mock.profile._id];

    new Group(exampleGroup).save()
      .then(group => {
        this.tempGroup = group;
        done();
      })
      .catch(done);
  });

  afterEach(done => {
    Promise.all([
      fakeProfile.remove,
      Group.remove({}),
    ])
      .then(() => done())
      .catch(done);
  });

  // POST TESTS START HERE

  describe('POST: /api/group', () => {
    describe('with valid body and token', () => {
      it('should give 200 status', done => {
        request.post(`${url}/api/group`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .send(exampleGroup)
          .end((err, res) => {
            expect(res.status).toEqual(200);
            expect(res.body.groupName).toEqual(exampleGroup.groupName);
            expect(res.body.privacy).toEqual(exampleGroup.privacy);
            done();
          });
      });
    });

    describe('with invalid body', () => {
      it('should give 400 status', done => {
        request.post(`${url}/api/group`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .send({})
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });

    describe('with valid body and no token', () => {
      it('should give 200 status', done => {
        request.post(`${url}/api/group`)
          .set({
            Authorization: `Bearer `,
          })
          .send(exampleGroup)
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
    });
  });

  // GET TESTS START HERE

  describe('GET: /api/groups', () => {
    describe('with valid token', () => {
      it('should give 200 status', done => {
        request.get(`${url}/api/groups`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });
    });

    describe('with invalid token', () => {
      it('should give 200 status', done => {
        request.get(`${url}/api/groups`)
          .set({
            Authorization: `Bearer `,
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
    });
  });

  describe('GET: /api/group/:groupId', () => {
    describe('with valid groupId', () => {
      it('should give 200 response code', done => {
        request.get(`${url}/api/group/${this.tempGroup._id}`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(200);
            expect(res.body.groupName).toEqual(exampleGroup.groupName);
            expect(res.body.privacy).toEqual(exampleGroup.privacy);
            expect(res.body.owner).toEqual(exampleGroup.owner.toString());
            expect(res.body.users.toString()).toEqual(exampleGroup.users.toString());
            done();
          });
      });
    });

    describe('with invalid groupId', () => {
      it('should give a 404 error', done => {
        request.get(`${url}/api/group/123456`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });
    });

    describe('with no groupId', () => {
      it('should give an error', done => {
        request.get(`${url}/api/group/`)
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
      it('should give an error', done => {
        request.get(`${url}/api/group/${this.tempGroup._id}`)
          .set({
            Authorization: `Bearer `,
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
    });
  });

  // PUT TESTS START HERE

  describe('PUT: /api/group/:groupId', () => {
    describe('without being the owner', () => {
      it('should give 200 status', done => {
        request.put(`${url}/api/group/${this.tempGroup._id}`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .send({groupName:'new group name'})
          .end((err, res) => {
            expect(res.status).toEqual(403);
            done();
          });
      });
    });
  });
});