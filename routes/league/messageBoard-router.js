'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:messageBoard-router');
const createError = require('http-errors');

const MessageBoard = require('../../model/league/messageBoard.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const messageBoardRouter = module.exports = Router();

// messageBoardRouter.post('/api/messageboard', bearerAuth, jsonParser, function(req, res, next) {
//   debug('POST: /api/messageboard');

//   if (!req.body.leagueID && !req.body.groupID ) return next(createError(400, 'expected a request body leagueID or groupID'));
//   new MessageBoard(req.body).save()
//     .then( messageBoard => res.json(messageBoard))
//     .catch(next);
// });

messageBoardRouter.get('/api/messageboard/:messageBoardId', bearerAuth, function(req, res, next) {
  debug('GET: /api/messageboard/:messageBoardId');

  MessageBoard.findById(req.params.messageBoardId)
    .then( messageBoard => res.json(messageBoard))
    .catch(next);
});

messageBoardRouter.put('/api/messageboard/:messageBoardId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/messageboard:messageBoardId');

  if (!req.body) return next(createError(400, 'expected a request body'));
  MessageBoard.findByIdAndUpdate(req.params.messageBoardId, req.body, {new: true})
    .then( messageBoard => res.json(messageBoard))
    .catch(next);
});

messageBoardRouter.delete('/api/messageboard/:messageBoardId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/messageboard/:messageBoardId');

  MessageBoard.findByIdAndRemove(req.params.messageBoardId)
    .then( () => res.status(204).send())
    .catch(next);
});