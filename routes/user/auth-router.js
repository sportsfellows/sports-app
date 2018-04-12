'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:auth-router');
const createError = require('http-errors');
const Router = require('express').Router;
const basicAuth = require('../../lib/basic-auth-middleware.js');
const User = require('../../model/user/user.js');

const authRouter = module.exports = Router();

// http POST :3000/api/signup username=aaaaaaa email=brewgewgewbianbixby0@gmail.com password=password1
authRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST: /api/signup');
  if (!req.body.username || !req.body.email || !req.body.password) return next(createError(400, 'expected a request body username, email and password'));

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);
  user.generatePasswordHash(password)
    .then( user => user.save())
    .then( () => user.generateToken())
    .then( token => res.send(token))
    .catch(next);
});

// http -a aaaaaaa:password1 :3000/api/signin
authRouter.get('/api/signin', basicAuth, function(req, res, next) {
  debug('GET: /api/signin');
 
  User.findOne({ username: req.auth.username})
    .then(myUser => {
      if(!myUser) throw createError(401);
      return myUser;
    })
    .then( myUser => myUser.comparePasswordHash(req.auth.password))
    .then( myUser => myUser.generateToken())
    .then( token => res.send(token))
    .catch(next);
});