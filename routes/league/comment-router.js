'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:comment-router');
const createError = require('http-errors');

const Comment = require('../../model/league/comment.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const commentRouter = module.exports = Router();

commentRouter.post('/api/comment', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/comment');

  if (!req.body.userID || !req.body.messageBoardID || !req.body.content) return next(createError(400, 'expected a request body userID, messageBoardID and content'));
  new Comment(req.body).save()
    .then( comment => res.json(comment))
    .catch(next);
});

commentRouter.get('/api/comment/:commentId', bearerAuth, function(req, res, next) {
  debug('GET: /api/comment/:commentId');

  Comment.findById(req.params.commentId)
    .then( comment => res.json(comment))
    .catch(next);
});

commentRouter.put('/api/comment/:commentId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/comment:commentId');

  if (!req.body) return next(createError(400, 'expected a request body'));
  Comment.findByIdAndUpdate(req.params.commentId, req.body, {new: true})
    .then( comment => res.json(comment))
    .catch(next);
});


commentRouter.delete('/api/comment/:commentId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/comment/:commentId');

  Comment.findByIdAndRemove(req.params.commentId)
    .then( () => res.status(204).send())
    .catch(next);
});