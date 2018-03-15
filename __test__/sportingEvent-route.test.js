'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

const User = require('../model/user/user.js');
const SportingEvent = require('../model/sportingEvent/sportingEvent.js');

require('jest');
const url = 'http://localhost:3000';

const exampleUser = { username: 'exampleuser', password: '1234', email: 'exampleuser@test.com' };
const exampleSportingEvent = { sportingEventName: 'examplesportingevent', desc: 'example desc', tags: '2018'};
const exampleSportingEvent2 = { sportingEventName: 'examplesportingevent', tags: '2018'};
const DATE_TO_USE = new Date('2016');
const _Date = Date;
global.Date = jest.fn(() => DATE_TO_USE);
global.Date.UTC = _Date.UTC;
global.Date.parse = _Date.parse;
global.Date.now = _Date.now;

describe('SportingEvent routes', function() {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });
  beforeEach( done => {
    new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
  });
  afterEach( done => {
    Promise.all([
      User.remove({}),
      SportingEvent.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  describe('POST: /api/sportingevent', () => {
    it('should create and return a sporting event', done => {
      request.post(`${url}/api/sportingevent`)
        .send(exampleSportingEvent)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.sportingEventName).toEqual(exampleSportingEvent.sportingEventName);
          expect(res.body.desc).toEqual(exampleSportingEvent.desc);
          expect(res.body.tags).toEqual([exampleSportingEvent.tags]);
          expect(res.body.createdOn).toEqual('2016-01-01T00:00:00.000Z');
          done();
        });
    });

    it('should return 404 for route not found', done => {
      request.post(`${url}/api/sportingeve`)
        .send(exampleSportingEvent)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });

    it('should return a 401 error, no token', done => {
      request.post(`${url}/api/sportingevent`)
        .send(exampleSportingEvent)
        .set({
          Authorization: 'Bearer ',
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });

    it('should return a 400 error, no body/ body erroe', done => {
      request.post(`${url}/api/sportingevent`)
        .send()
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(400);
          done();
        });
    });

    it('should return a 400 error, body error', done => {
      request.post(`${url}/api/sportingevent`)
        .send(exampleSportingEvent2)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(400);
          done();
        });
    });
  });

  describe('GET: /api/sportingevent/:listId && /api/sportingevent', () => {
    it('should return a list and a 200 status', done => {
      request.get(`${url}/api/sportingevent/${this.tempList.id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.sportingEventName).toEqual(exampleSportingEvent.sportingEventName);
          expect(res.body.desc).toEqual(exampleSportingEvent.desc);
          expect(res.body.tags).toEqual(exampleSportingEvent.tags);
          expect(res.body.createdOn).toEqual('2016-01-01T00:00:00.000Z');
          done();
        });
    });

    it('should return a 401 when no token is provided', done => {
      request.get(`${url}/api/sportingevent/${this.tempList.id}`)
        .set({
          Authorization: 'Bearer',
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });

    it('should return a 404 for a valid req with a list id not found', done => {
      request.get(`${url}/api/sportingevent/a979e472c577c679758e018`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });

    it('should return all lists and a 200 status', done => {
      request.get(`${url}/api/sportingevents`)
        .set({
          Authorization: `Bearer ${this.tempToken}`, 
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body[0].name).toEqual(exampleList.name);
          expect(res.body[0].desc).toEqual(exampleList.desc);
          expect(res.body[0].userID).toEqual(this.tempUser.id.toString());
          expect(res.body[1].name).toEqual(exampleList2.name);
          expect(res.body[1].desc).toEqual(exampleList2.desc);
          expect(res.body[1].userID).toEqual(this.tempUser.id.toString());
          done();
        });
    });

    it('should return a 401 when no token is provided', done => {
      request.get(`${url}/api/sportingevents`)
        .set({
          Authorization: 'Bearer',
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });
  });

  // describe('DELETE: /api/sportingevent/:listId && /api/sportingevent', () => {
  //   beforeEach( done => {
  //     new User(exampleUser)
  //       .generatePasswordHash(exampleUser.password)
  //       .then( user => {
  //         this.tempUser = user;
  //         return user.generateToken();
  //       })
  //       .then( token => {
  //         this.tempToken = token;
  //         done();
  //       })
  //       .catch(done);
  //   });

  //   beforeEach( done => {
  //     exampleList.userID = this.tempUser.id.toString();
  //     new List(exampleList).save()
  //       .then( list => {
  //         this.tempList = list;
  //         done();
  //       })
  //       .catch(done);
  //   });

  //   afterEach( () => {
  //     delete exampleList.userID;
  //   });

  //   it('should delete a list and return a 204 status', done => {
  //     request.delete(`${url}/api/sportingevent/${this.tempList.id}`)
  //       .set({
  //         Authorization: `Bearer ${this.tempToken}`,
  //       })
  //       .end((err, res) => {
  //         if(err) return done(err);
  //         expect(res.status).toEqual(204);
  //         done();
  //       });
  //   });

  //   it('should not delete and return a 401 when no token is provided', done => {
  //     request.delete(`${url}/api/sportingevent/${this.tempList.id}`)
  //       .set({
  //         Authorization: 'Bearer',
  //       })
  //       .end((err, res) => {
  //         expect(res.status).toEqual(401);
  //         done();
  //       });
  //   });

  //   it('should not delete and return a 404 error for a valid req with a list id not found', done => {
  //     request.delete(`${url}/api/sportingevent/404`)
  //       .set({
  //         Authorization: `Bearer ${this.tempToken}`,
  //       })
  //       .end((err, res) => {
  //         expect(res.status).toEqual(404);
  //         done();
  //       });
  //   });

  //   it('should not delete and return a 400 error for a req with no list id', done => {
  //     request.delete(`${url}/api/sportingevent`)
  //       .set({
  //         Authorization: `Bearer ${this.tempToken}`,
  //       })
  //       .end((err, res) => {
  //         expect(res.status).toEqual(400);
  //         done();
  //       });
  //   });
  // });

  // describe('PUT: /api/sportingevent/:listId && /api/sportingevent', () => {
  //   beforeEach( done => {
  //     new User(exampleUser)
  //       .generatePasswordHash(exampleUser.password)
  //       .then( user => {
  //         this.tempUser = user;
  //         return user.generateToken();
  //       })
  //       .then( token => {
  //         this.tempToken = token;
  //         done();
  //       })
  //       .catch(done);
  //   });

  //   beforeEach( done => {
  //     exampleList.userID = this.tempUser.id.toString();
  //     new List(exampleList).save()
  //       .then( list => {
  //         this.tempList = list;
  //         done();
  //       })
  //       .catch(done);
  //   });

  //   afterEach( () => {
  //     delete exampleList.userID;
  //   });

  //   it('should update and return a list with a 200 status', done => {
  //     request.put(`${url}/api/sportingevent/${this.tempList.id}`)
  //       .send(updatedList)
  //       .set({
  //         Authorization: `Bearer ${this.tempToken}`,
  //       })
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         expect(res.status).toEqual(200);
  //         expect(res.body.desc).toEqual(updatedList.desc);
  //         expect(res.body.name).toEqual(updatedList.name);
  //         expect(res.body.userID).toEqual(this.tempUser.id.toString());
  //         done();
  //       });
  //   });

  //   it('should  not update and return a 400 status for invalid req', done => {
  //     request.put(`${url}/api/sportingevent/${this.tempList.id}`)
  //       .send()
  //       .set({
  //         Authorization: `Bearer ${this.tempToken}`,
  //       })
  //       .end((err, res) => {
  //         expect(res.status).toEqual(400);
  //         done();
  //       });
  //   });

  //   it('should  not update and return a 401 status', done => {
  //     request.put(`${url}/api/sportingevent/${this.tempList.id}`)
  //       .send(updatedList)
  //       .set({
  //         Authorization: `Bearer `,
  //       })
  //       .end((err, res) => {
  //         expect(res.status).toEqual(401);
  //         done();
  //       });
  //   });

  //   it('should  not update and return a 404 status for user list not found', done => {
  //     request.put(`${url}/api/sportingevent/a979e472c577c679758e018`)
  //       .send(updatedList)
  //       .set({
  //         Authorization: `Bearer ${this.tempToken}`,
  //       })
  //       .end((err, res) => {
  //         expect(res.status).toEqual(404);
  //         done();
  //       });
  //   });

  //   it('should  not update and return a 400 error for a req with no list id', done => {
  //     request.put(`${url}/api/sportingevent`)
  //       .send(updatedList)
  //       .set({
  //         Authorization: `Bearer ${this.tempToken}`,
  //       })
  //       .end((err, res) => {
  //         expect(res.status).toEqual(400);
  //         done();
  //       });
  //   });


  // });
});