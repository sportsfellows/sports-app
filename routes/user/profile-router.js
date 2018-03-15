'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:profile-router');
const createError = require('http-errors');

const Profile = require('../../model/user/profile.js');
const User = require('../../model/user/user.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = Router();


profileRouter.get('/api/profile/:profileId', bearerAuth, function (req, res, next) {
  debug('GET: /api/profile/:profileId');

  Profile.findById(req.params.profileId)
    .then(profile => res.json(profile))
    .catch(next);
});

// http PUT :3000/api/profile/5aa707a2d7a062450bf27681 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjBhMDY0OWFhMTEzMjdiYTE3NWQxYjZlY2U4MTQ2NGUwZmRlMGYyZTUwZDJiOTBhODY3MmNkZjM1ZWFhODE5NTQiLCJpYXQiOjE1MjA4OTU5MDZ9.d6laLwuZ_fv_pFEX550xzIdbCT_cCDBHIr0Rro7BMfM' name='new list name' state='wa' 
profileRouter.put('/api/profile/:profileId', bearerAuth, jsonParser, function (req, res, next) {
  debug('PUT: /api/profile:profileId');

  if (!req.body) return next(createError(400, 'expected a request body'));
  Profile.findByIdAndUpdate(req.params.profileId, req.body, { new: true })
    .then( myProfile => {
      let usernameObj = {username: myProfile.username };
      return User.findByIdAndUpdate(myProfile.userID, usernameObj, {new: true})
        .then(() => myProfile)
        .catch(next);
    })
    .then(profile => res.json(profile))
    .catch(next);
});