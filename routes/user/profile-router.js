'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('sportsapp:profile-router');

const Profile = require('../../model/user/profile.js');
const User = require('../../model/user/user.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = Router();

// http POST :3000/api/5acd96a97f2c024cc4edee08/profile 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImZmY2VmYzczNzA1OTJiNTdkYTI0ODQ4ZjkyNTMxM2ZlZjlkODc3NGQyY2RlNjQ0ZTA4YjhmMGRkNTY3MTk2MzgiLCJpYXQiOjE1MjM0MjI4ODl9.mTJvkL_ktAuLsbd7U6i31Uh4WjR7abEUsBGroRniXck' username='testing123'
profileRouter.post('/api/:userId/profile', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/profile');

  if (!req.body.username ) return next(createError(400, 'expected a request body username'));
  req.body.userID = req.params.userId;

  new Profile(req.body).save()
    .then( myProfile => {
      return User.findById(req.params.userId)
        .then( user => {
          user.profileID = myProfile._id;
          user.save();
          return myProfile;
        });
    })
    .then( myProfile => res.json(myProfile))
    .catch(next);
});

profileRouter.get('/api/profile/:profileId', bearerAuth, function (req, res, next) {
  debug('GET: /api/profile/:profileId');

  Profile.findById(req.params.profileId)
    .then(profile => res.json(profile))
    .catch(next);
});

// http PUT :3000/api/profile/5aaac0153bba352361732273 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImI2YmE0YTRkN2Y4NmI1YjZmNDAzMWQ3NjUwZjNiN2JhZGJjZTBlMjE4MTdjOWQ1MDk3NDhkZmU3ODNhY2YzYTMiLCJpYXQiOjE1MjExNDU0NzJ9.Y8qBhJlfLcTJpQH2MBoheZd2j8KDZT7-KM3rQgYV0uM' name='new list name' state='wa' 
profileRouter.put('/api/profile/:profileId', bearerAuth, jsonParser, function (req, res, next) {
  debug('PUT: /api/profile:profileId');

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