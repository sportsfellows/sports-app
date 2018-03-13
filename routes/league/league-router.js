'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:league-router');
const createError = require('http-errors');

const League = require('../../model/league/league.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const leagueRouter = module.exports = Router();

leagueRouter.post('/api/league', bearerAuth, jsonParser, function(req, res, next) {
  debug(`POST: /api/league`);

  if (!req.body.leagueName || !req.body.sportingEventID || !req.body.owner || !req.body.scoring || !req.body.poolSize || !req.body.privacy) return next(createError(400, 'expected a request body  leagueName, sportingeventID, owner, scoring, poolSize and privacy'));
  new League(req.body).save()
    .then (league => res.json(league))
    .catch(next);
});

leagueRouter.get('/api/league/:leagueId', bearerAuth, function(req, res, next) {
  debug('GET: /api/league/:leagueId');

  League.findById(req.params.leagueId)
    .then( league => res.json(league))
    .catch(next);
});

leagueRouter.put('/api/league/:leagueId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/league/:leagueId');

  if (!req.body) return next(createError(400, 'expected a request body'));
  League.findByIdAndUpdate(req.params.leagueId, req.body, {new: true })
    .then( league => res.json(league))
    .catch(next);
});

leagueRouter.delete('/api/league/:leagueId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/league/:leagueId');

  League.findByIdAndRemove(req.params.leagueId)
    .then( () => res.status(204).send())
    .catch(next);
});