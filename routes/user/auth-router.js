'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:auth-router');
const createError = require('http-errors');
const Router = require('express').Router;
const basicAuth = require('../../lib/basic-auth-middleware.js');
const bearerAuth = require('../../lib/bearer-auth-middleware');
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
    .then( token => {
      res.cookie('Bracket-Busters-Token', token, {maxAge: 604800000});
      res.send(token);
    })
    .catch(next);
});

// http -a briguy999:password1 :3000/api/signin
authRouter.get('/api/signin', basicAuth, function(req, res, next) {
  debug('GET: /api/signin');
  console.log('req.auth', req.auth);
  console.log('req.user', req.headers.authorization);
  let currentUser = User.findOne({ username: req.auth.username})
    .then(user => {
      if(!user) throw createError(401);
      return currentUser = user;
    })
    .then( user => user.comparePasswordHash(req.auth.password))
    .then( user => user.generateToken())
    .then( token => {
      return Profile.findOne({ userID: currentUser._id })
        .then( profile => {
          profile.lastLogin = new Date();
          profile.save();
          res.cookie('Bracket-Busters-Token', token, {maxAge: 604800000});
          res.send(token);
        });
    })
    // .then( token => res.send(token))
    .catch(next);
});
// .then( token => res.send(token))

authRouter.get('/api/signup/usernames/:username', (req, res, next) => {
  User.findOne({username: req.params.username})
    .then(user => {
      if(!user)
        return res.sendStatus(200);
      return res.sendStatus(409);
    })
    .catch(next);
});

authRouter.get('/api/signin/token', bearerAuth, (req, res, next) => {
  debug('GET: /api/signin/token');

  let currentUser = User.findById(req.user._id)
    .then(user => {
      if(!user) throw createError(401);
      return currentUser = user;
    })
    .then( user => user.generateToken())
    .then( token => {
      return Profile.findOne({ userID: currentUser._id })
        .then( profile => {
          profile.lastLogin = new Date();
          profile.save();
          res.cookie('Bracket-Busters-Token', token, {maxAge: 604800000});
          res.send(token);
        });
    })
    .catch(next);
});

