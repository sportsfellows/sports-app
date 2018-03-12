'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:group-router');
const createError = require('http-errors');

const Group = require('../../model/league/group.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const groupRouter = module.exports = Router();

groupRouter.post('/api/group', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/group');

  if (!req.body.groupName || !req.body.privacy || !req.body.owner) return next(createError(400, 'expected a request body groupName, privacy and owner'));
  req.body.owner = req.user._id;
  req.body.users = req.user._id;
  new Group(req.body).save()
    .then (group => res.json(group))
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