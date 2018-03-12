'use strict';


const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:team-router');

const Team = require('../../model/team/team.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const teamRouter = module.exports = Router();

teamRouter.get('/api/team/:teamId', bearerAuth, function(req, res, next) {
  debug('GET: /api/team/:teamId');

  Team.findById(req.params.teamId)
    .then( team => res.json(team))
    .catch(next);
});

teamRouter.post('api/team/:teamId', bearerAuth, function(req, res, next) {
  debug('POST: /api/team/teamId');

  new Team(req.body).save()
    .then (team => res.json(team))
    .catch(next);
});


teamRouter.put('/api/team/:teamId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/team/teamId');

  Team.findByIdAndUpdate(req.params.teamId, req.body, { new: true })
    .then( team => res.json(team))
    .catch(next);
});
  
teamRouter.delete('/api/team/:teamId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/team/:teamId');

  Team.findByIdAndRemove(req.params.teamId)
    .then( () => res.status(204).send())
    .catch(next);
});
