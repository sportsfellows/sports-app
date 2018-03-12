'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:profile-router');
// const createError = require('http-errors');

const Profile = require('../../model/user/profile.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = Router();

profileRouter.post('/api/profile', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/profile');

  req.body.userID = req.user._id;
  new Profile(req.body).save()
    .then( profile => res.json(profile))
    .catch(next);
});

profileRouter.get('/api/profile/:profileId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId');

  Profile.findById(req.params.profileId)
    .then( profile => res.json(profile))
    .catch(next);
});

profileRouter.put('/api/profile/:profileId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/profile:profileId');

  // TO DO: CREATE 400 ERROR IF NO REQ BODY
  // TO DO: CREATE 400 ERROR IF NO PROFILE ID

  Profile.findByIdAndUpdate(req.params.profileId, req.body, {new: true})
    .then( profile => res.json(profile))
    .catch(next);
});


profileRouter.delete('/api/profile/:profileId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/profile/:profileId');

  // TO DO: CREATE 400 ERROR IF NO PROFILE ID

  Profile.findByIdAndRemove(req.params.profileId)
    .then( () => res.status(204).send())
    .catch(next);
});