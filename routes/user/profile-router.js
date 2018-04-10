'use strict';

// Review: Would there ever be a need to delete a profile?

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:profile-router');

const Profile = require('../../model/user/profile.js');
const User = require('../../model/user/user.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = Router();
// Review: remove this extra line

profileRouter.get('/api/profile/:profileId', bearerAuth, function (req, res, next) {
  debug('GET: /api/profile/:profileId');

  Profile.findById(req.params.profileId)
    // Review: you should have a check in here to ensure the profile exists, and if not, throw an error
    .then(profile => res.json(profile))
    .catch(next);
});

// Review: this token should be removed
// http PUT :3000/api/profile/5aaac0153bba352361732273 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImI2YmE0YTRkN2Y4NmI1YjZmNDAzMWQ3NjUwZjNiN2JhZGJjZTBlMjE4MTdjOWQ1MDk3NDhkZmU3ODNhY2YzYTMiLCJpYXQiOjE1MjExNDU0NzJ9.Y8qBhJlfLcTJpQH2MBoheZd2j8KDZT7-KM3rQgYV0uM' name='new list name' state='wa' 
profileRouter.put('/api/profile/:profileId', bearerAuth, jsonParser, function (req, res, next) {
  debug('PUT: /api/profile:profileId');

  // Review: There is another option you can pass with an update, which is runValidators: true. This ensures that all of the original tests for uniqueness existence pass with the upade as well
  Profile.findByIdAndUpdate(req.params.profileId, req.body, { new: true })
    .then( myProfile => {
      let usernameObj = {username: myProfile.username };
      return User.findByIdAndUpdate(myProfile.userID, usernameObj, {new: true})
      // Review: Why not just res.json(myProfile) right here?
        .then(() => myProfile)
        .catch(next);
    })
    .then(profile => res.json(profile))
    .catch(next);
});
