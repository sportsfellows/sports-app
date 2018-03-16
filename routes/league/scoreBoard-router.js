'use strict';

const Router = require('express').Router;
const debug = require('debug')('sportsapp:scoreBoard-router');

const ScoreBoard = require('../../model/league/scoreBoard.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const scoreBoardRouter = module.exports = Router();


scoreBoardRouter.get('/api/scoreboard/:scoreBoardId', bearerAuth, function(req, res, next) {
  debug('GET: /api/scoreboard/:scoreBoardId');

  ScoreBoard.findById(req.params.scoreBoardId)
    .then( scoreBoard => res.json(scoreBoard))
    .catch(next);
});

scoreBoardRouter.get('/api/scoreboards', bearerAuth, function(req, res, next) {
  debug('GET: /api/scoreboards');

  ScoreBoard.find()
    .then(scoreboards => res.json(scoreboards))
    .catch(next);
});