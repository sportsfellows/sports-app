'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:auth-router');
const createError = require('http-errors');
const Router = require('express').Router;
const basicAuth = require('../../lib/basic-auth-middleware.js');
// const bearerAuth = require('../../lib/bearer-auth-middleware.js');
const User = require('../../model/user/user.js');
const Profile = require('../../model/user/profile.js');

const authRouter = module.exports = Router();

authRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST: /api/signup');
  if (!req.body.username || !req.body.email || !req.body.password) return next(createError(400, 'expected a request body username, email and password'));

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);
  user.generatePasswordHash(password)
    .then( user => user.save())
    .then( user => user.generateToken())
    .then( token => res.send(token))
    .then( user => {
      let profile = { userID }
    })
    // new Profile(req.body).save()
    // .then(profile => res.json(profile))
    // .catch(next);
    .catch(next);

  
});

authRouter.get('/api/signin', basicAuth, function(req, res, next) {
  debug('GET: /api/signin');

  User.findOne({ username: req.auth.username})
    .then( user => user.comparePasswordHash(req.auth.password))
    .then( user => user.generateToken())
    .then( token => res.send(token))
    .catch(next);
});

// authRouter.put('/api/signin', bearerAuth, jsonParser, function(req, res, next) {
//   debug('PUT: /api/signin');

//   let user = req.body;
//   console.log(user);
//   if(req.body.password) {
//     user.generatePasswordHash(user.password);
//   }

//   User.findByIdAndUpdate(req.user._id, user, {new: true})
//     .then( user => user.generateToken())
//     .then( token => res.send(token))
//     .catch(next);
// });
