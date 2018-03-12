'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('note:league-router');
// const createError = require('http-errors');
const League = require('../model/league.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');
const leagueRouter = module.exports = new Router();

leagueRouter.get('/api/league/:leagueId', bearerAuth, function(req, res, next) {
  debug('GET: /api/league/:leagueId');

  League.findById(req.params.leagueId)
    .then( league => res.json(league))
    .catch(next);
});

leagueRouter.post('/api/league', bearerAuth, jsonParser, function(req, res, next) {
  debug(`POST: /api/league`);

  new League(req.body).save()
    .then (league => res.json(league))
    .catch(next);
});

leagueRouter.put('/api/league/:leagueId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/league/:leagueId');

  League.findByIdAndUpdate(req.params.leagueId, req.body, {new: true })
    .then( profile => res.json( profile))
    .catch(next);
});

leagueRouter.delete('/api/league/:leagueId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/league/:leagueId');

  // TO DO: CREATE 400 ERROR IF NO PROFILE ID

  League.findByIdAndRemove(req.params.profileId)
    .then( () => res.status(204).send())
    .catch(next);
});