'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:game-router');
const createError = require('http-errors');

const Game = require('../../model/sportingEvent/game.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const gameRouter = module.exports = Router();

gameRouter.post('/api/sportingevent/:sportingeventId/game', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/sportingevent/:sportingeventId/game');
  
  if (!req.body.homeTeam || !req.body.awayTeam || !req.body.dateTime ) return next(createError(400, 'expected a request body homeTeam, awayTeam and dateTime'));
  req.body.sportingEventID = req.params.sportingeventId;
  new Game(req.body).save()
    .then( game => res.json(game))
    .catch(next);
});

gameRouter.get('/api/game/:gameId', bearerAuth, function(req, res, next) {
  debug('GET: /api/game/:gameId');

  Game.findById(req.params.gameId)
    .then( game => res.json(game))
    .catch(next);
});

gameRouter.get('/api/games', bearerAuth, function(req, res, next) {
  debug('GET: /api/games');

  Game.find()
    .then(games => res.json(games))
    .catch(next);
});

gameRouter.put('/api/game/:gameId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/game:gameId');

  if (!req.body) return next(createError(400, 'expected a request body'));
  Game.findByIdAndUpdate(req.params.gameId, req.body, {new: true})
    .then( game => res.json(game))
    .catch(next);
});