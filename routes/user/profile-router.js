'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('sportsapp:profile-router');

const Profile = require('../../model/user/profile.js');
const User = require('../../model/user/user.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = Router();

// http POST :3000/api/profiles 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImY2YzY0ZGUyNjQyNzk2ZTBhNThjOTZlYTRhMDE3YjRjYzZkMzBlM2ZiMmI2MzgwMjVhYmQ3MWQxODc2YjZmN2YiLCJpYXQiOjE1MjM1NjE2NjR9.idrBodvQLicApzQ_KJWIHwMWzZlBFqcJlQXoepLKtwc' username='testing123'
profileRouter.post('/api/profiles', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/profile');
  console.log('req: ', req);
  if (!req.body.username ) return next(createError(400, 'expected a request body username'));

  return new Profile({
    userID: req.user._id,
    username: req.user.username,
    image: req.body.image,
    country: req.body.country,
    state: req.body.state,
    birthdate: req.body.birthdate,
    tags: req.body.tags,
  }).save()
    .then( profile => {
      req.user.profileID = profile._id;
      return req.user.save()
        .then(() => res.json(profile));
    })
    .catch(next);
});

// http GET :3000/api/profiles/currentuser 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImY2YzY0ZGUyNjQyNzk2ZTBhNThjOTZlYTRhMDE3YjRjYzZkMzBlM2ZiMmI2MzgwMjVhYmQ3MWQxODc2YjZmN2YiLCJpYXQiOjE1MjM1NjE2NjR9.idrBodvQLicApzQ_KJWIHwMWzZlBFqcJlQXoepLKtwc'
profileRouter.get('/api/profiles/currentuser', bearerAuth, function (req, res, next) {
  debug('GET: /api/profiles/currentuser');

  Profile.findOne({ userID: req.user._id })
    .then(profile => {
      if(!profile) return next(createError(404, 'NOT FOUND ERROR: profile not found'));
      res.json(profile);
    })
    .catch(next);
});

// http PUT :3000/api/profiles/5acfb519d3d9e5087bc12352 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImY2YzY0ZGUyNjQyNzk2ZTBhNThjOTZlYTRhMDE3YjRjYzZkMzBlM2ZiMmI2MzgwMjVhYmQ3MWQxODc2YjZmN2YiLCJpYXQiOjE1MjM1NjE2NjR9.idrBodvQLicApzQ_KJWIHwMWzZlBFqcJlQXoepLKtwc' tags='new tag'
profileRouter.put('/api/profiles/:profileId', bearerAuth, jsonParser, function (req, res, next) {
  debug('PUT: /api/profiles:profileId');

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