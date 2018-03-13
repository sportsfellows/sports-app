'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:team-router');
const createError = require('http-errors');

const Team = require('../../model/sportingEvent/team.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const teamRouter = module.exports = Router();

teamRouter.post('/api/team', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/team');

  if (!req.body.teamName || !req.body.sportingEventID) return next(createError(400, 'expected a request body teamName and sportingEventID'));
  new Team(req.body).save()
    .then( team => res.json(team))
    .catch(next);
});

teamRouter.get('/api/team/:teamId', bearerAuth, function(req, res, next) {
  debug('GET: /api/team/:teamId');

  Team.findById(req.params.team)
    .then( team => res.json(team))
    .catch(next);
});

teamRouter.put('/api/team/:teamId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/team:teamId');

  if (!req.body) return next(createError(400, 'expected a request body'));
  Team.findByIdAndUpdate(req.params.teamId, req.body, {new:true})
    .then( team => res.json(team))
    .catch(next);
});

teamRouter.delete('/api/team/:teamId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/team/:teamId');

  Team.findByIdAndRemove(req.params.teamId)
    .then(() => res.status(204).send())
    .catch(next);
});