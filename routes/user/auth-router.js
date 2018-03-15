'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:auth-router');
const createError = require('http-errors');
const Router = require('express').Router;
const basicAuth = require('../../lib/basic-auth-middleware.js');
const User = require('../../model/user/user.js');
const Profile = require('../../model/user/profile.js');

const authRouter = module.exports = Router();

// http POST :3000/api/signup username=briguy999 email=brianbixby0@gmail.com password=password1
authRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST: /api/signup');
  if (!req.body.username || !req.body.email || !req.body.password) return next(createError(400, 'expected a request body username, email and password'));

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);
  user.generatePasswordHash(password)
    .then( user => user.save())
    .then( myUser => {
      user = myUser;
      return new Profile({userID: user._id, username: user.username}).save();
    })
    .then( () => user.generateToken())
    .then( token => res.send(token))
    .catch(next);
});

authRouter.get('/api/signin', basicAuth, function(req, res, next) {
  debug('GET: /api/signin');
 
  User.findOne({ username: req.auth.username})
    .then(user => {
      if(!user) throw createError(401);
      return user;
    })
    .then( user => user.comparePasswordHash(req.auth.password))
    .then( user => user.generateToken())
    .then( token => res.send(token))
    .catch(next);
});