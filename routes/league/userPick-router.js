'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:userPick-router');
const createError = require('http-errors');

const UserPick = require('../../model/league/userPick.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const userPickRouter = module.exports = Router();



userPickRouter.get('/api/userpick:userPickId', bearerAuth, function(req, res, next) {
  debug('GET: /api/userpick/:userPickId');

  UserPick.findById(req.params.userPickId)
    .then( userPick => res.json(userPick))
    .catch(next);
});

userPickRouter.get('/api/userpicks', bearerAuth, function(req, res, next) {
  debug('GET: /api/userpicks');

  UserPick.find()
    .then(userPicks => res.json(userPicks))
    .catch(next);
});

userPickRouter.post('/api/league/:leagueId/userpick', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/league/:leagueId/userpick');

  if (!req.body.pick || !req.body.gameID || !req.body.gameTime ) return next(createError(400, 'expected a request body, gameID, pick and gametime'));

  req.body.userID = req.user._id;
  req.body.leagueID = req.params.leagueId;
  new UserPick(req.body).save()
    .then( userPick => res.json(userPick))
    .catch(next);
});

userPickRouter.put('/api/userpick/:userPickId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/userpick:userPickId');

  if (!req.body) return next(createError(400, 'expected a request body'));
  UserPick.findByIdAndUpdate(req.params.userPickId, req.body, {new: true})
    .then( userPick => res.json(userPick))
    .catch(next);
});

// userPickRouter.delete('/api/userpick/:userPickId', bearerAuth, function(req, res, next) {
//   debug('DELETE: /api/userpick/:userPickId');

//   UserPick.findByIdAndRemove(req.params.userPickId)
//     .then( () => res.status(204).send())
//     .catch(next);
// });