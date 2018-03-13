'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:comment-router');
const createError = require('http-errors');

const Comment = require('../../model/league/comment.js');
const MessageBoard = require('../../model/league/messageBoard.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const commentRouter = module.exports = Router();

commentRouter.post('/api/messageboard/:messageBoardId/comment', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/messageboard/:messageBoardId/comment'); 

  if (!req.body.content) return next(createError(400, 'expected a request body userID and content'));
  req.body.userID = req.user._id;

  MessageBoard.findByIdAndAddComment(req.params.messageBoardId, req.body)
    .then ( comment => res.json(comment))
    .catch(next);
});

commentRouter.get('/api/comment/:commentId', bearerAuth, function(req, res, next) {
  debug('GET: /api/comment/:commentId');

  Comment.findById(req.params.commentId)
    .then( comment => res.json(comment))
    .catch(next);
});

commentRouter.get('/api/comments', bearerAuth, function(req, res, next) {
  debug('GET: /api/comments');

  Comment.find()
    .then(comments => res.json(comments))
    .catch(next);
});