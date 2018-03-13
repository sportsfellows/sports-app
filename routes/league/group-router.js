'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:group-router');
const createError = require('http-errors');

const Group = require('../../model/league/group.js');
const MessageBoard = require('../../model/league/messageBoard.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const groupRouter = module.exports = Router();

// http POST :3000/api/group 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjdjYWZmYTg1ZDlkZTM4YmM1ZTA5YjJhN2EyZWUyMzBiNWY0Y2ViM2UxYzM5MjE2YzNmMTUwNzUyZTVlMWUzMzMiLCJpYXQiOjE1MjA5MDQxNjB9.yhuxsiOaYoPtdCtYgGm8RHBjeQNfOIbSjbzCMSjIuQQ' groupName='a' privacy='a'
groupRouter.post('/api/group', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/group');

  if (!req.body.groupName || !req.body.privacy) return next(createError(400, 'expected a request body groupName, privacy'));
  req.body.owner = req.user._id;
  req.body.users = req.user._id;
 
  let group = new Group(req.body).save()
    .then( myGroup => {
      group = myGroup;
      return new MessageBoard({ groupID: group._id }).save();
    })
    .then( () => res.json(group))
    .catch(next);
}); 

groupRouter.get('/api/group/:groupId', bearerAuth, function(req, res, next) {
  debug('GET: /api/group/:groupId');

  Group.findById(req.params.groupId)
    .then(group => res.json(group))
    .catch(next);
});

groupRouter.put('/api/group/:groupId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/group/:groupId');

  if (!req.body) return next(createError(400, 'expected a request body'));
  Group.findByIdAndUpdate(req.params.groupId, req.body, {new: true})
    .then(group => res.json(group))
    .catch(next);
});

groupRouter.delete('/api/group/:groupId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/group/:groupId');

  Group.findByIdAndRemove(req.params.groupId)
    .then(() => res.status(204).send())
    .catch(next);
});