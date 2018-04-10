'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:team-router');
const createError = require('http-errors');

const Team = require('../../model/sportingEvent/team.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const teamRouter = module.exports = Router();

teamRouter.post('/api/sportingevent/:sportingEventId/team', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/team');

  if (!req.body.teamName) return next(createError(400, 'expected a request body teamName'));
  req.body.sportingEventID = req.params.sportingEventId;
  new Team(req.body).save()
    .then( team => res.json(team))
    .catch(next);
});

// Review: organizationally speaking it might be nice for the related routes to be grouped togehter
teamRouter.get('/api/team/:teamId', bearerAuth, function(req, res, next) {
  debug('GET: /api/team/:teamId');

  Team.findById(req.params.teamId)
    .then( team => res.json(team))
    .catch(next);
});

teamRouter.get('/api/teams', bearerAuth, function(req, res, next) {
  debug('GET: /api/teams');
  // Review: does this route work, do you not need to pass an empty object into the find?
  Team.find()
    .then(teams => res.json(teams))
    .catch(next);
});

teamRouter.put('/api/team/:teamId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/team:teamId');
  // Review: Maybe this check should be more specific?
  if (!req.body) return next(createError(400, 'expected a request body'));
  Team.findByIdAndUpdate(req.params.teamId, req.body, {new:true})
    .then( team => res.json(team))
    .catch(next);
});
