'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:comment-router');
const createError = require('http-errors');

const Comment = require('../../model/league/comment.js');
const MessageBoard = require('../../model/league/messageBoard.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const commentRouter = module.exports = Router();
// http POST :3000/api/messageboard/5aa8a33d28c5b66e00edac47/comment 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImJlOGJhYzg4MDNmMGY2MGVkYjRhYjc3N2UzYzVmMGE1ZWQxN2Q3ODhmNTJlNTM4NDU0ODJiMDI3NWYzYjYyNGYiLCJpYXQiOjE1MjEwMDEzMTJ9.O9beI1JAgSCKVHFSq1dxpQTIasE-YSf3WXYhXw1K2r8' content='my content'
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

// returns all comments for a messageboard
commentRouter.post('/api/comments/messageboard', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/comments/messageboard');
  console.log('req.body: ', req.body);
  Comment.find( { messageBoardID: { $in: req.body} } )
    .then(comments => {
      console.log('comments: ', comments);
      res.json(comments);
    })
    .catch(next);
});