'use strict';

const Router = require('express').Router;
const debug = require('debug')('sportsapp:messageBoard-router');

const MessageBoard = require('../../model/league/messageBoard.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const messageBoardRouter = module.exports = Router();

// Review: Careful with inconsistencies like id vs Id vs ID. You use ID in most places but not here. That can result in hard to find errors.
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
