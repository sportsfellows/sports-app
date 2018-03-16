'use strict';

const Router = require('express').Router;
const debug = require('debug')('sportsapp:messageBoard-router');


const MessageBoard = require('../../model/league/messageBoard.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const messageBoardRouter = module.exports = Router();

messageBoardRouter.get('/api/messageboard/:messageBoardId', bearerAuth, function(req, res, next) {
  debug('GET: /api/messageboard/:messageBoardId');

  MessageBoard.findById(req.params.messageBoardId)
    .then( messageBoard => res.json(messageBoard))
    .catch(next);
});

messageBoardRouter.get('/api/messageboards', bearerAuth, function(req, res, next) {
  debug('GET: /api/messageboards');

  MessageBoard.find()
    .then(messageBoards => res.json(messageBoards))
    .catch(next);
});

