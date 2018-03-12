'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:scoreBoard-router');
const createError = require('http-errors');

const ScoreBoard = require('../../model/league/scoreBoard.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const scoreBoardRouter = module.exports = Router();

scoreBoardRouter.post('/api/scoreboard', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/scoreboard');

  if (!req.body.leagueID || !req.body.userID ) return next(createError(400, 'expected a request body leagueID and userID'));
  new ScoreBoard(req.body).save()
    .then( scoreBoard => res.json(scoreBoard))
    .catch(next);
});

scoreBoardRouter.get('/api/scoreboard/:scoreBoardId', bearerAuth, function(req, res, next) {
  debug('GET: /api/scoreboard/:scoreBoardId');

  ScoreBoard.findById(req.params.scoreBoardId)
    .then( scoreBoard => res.json(scoreBoard))
    .catch(next);
});

scoreBoardRouter.put('/api/scoreboard/:scoreBoardId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/scoreboard:scoreBoardId');

  // TO DO: CREATE 400 ERROR IF NO REQ BODY
  // TO DO: CREATE 400 ERROR IF NO SCOREEBOARD ID

  ScoreBoard.findByIdAndUpdate(req.params.scoreBoardId, req.body, {new: true})
    .then( scoreBoard => res.json(scoreBoard))
    .catch(next);
});


scoreBoardRouter.delete('/api/scoreboard/:scoreBoardId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/scoreboard/:scoreBoardId');

  // TO DO: CREATE 400 ERROR IF NO SCOREBOARD ID

  ScoreBoard.findByIdAndRemove(req.params.scoreBoardId)
    .then( () => res.status(204).send())
    .catch(next);
});