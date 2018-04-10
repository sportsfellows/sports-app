'use strict';

// Review: Express has it's own built in middleware, which means one less dependency, yay!
// Review: You can pull Router and json out of it as follows:

// const { Router, json } = require('express); // cleannnnnn
// Review: Note: you would then use json in your route as json() with a function call


const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:auth-router');
const createError = require('http-errors');
const Router = require('express').Router;
const basicAuth = require('../../lib/basic-auth-middleware.js');
const User = require('../../model/user/user.js');
const Profile = require('../../model/user/profile.js');

const authRouter = module.exports = Router();

// http POST :3000/api/signup username=briguy999 email=brianbixby0@gmail.com password=password1
// Review: Why no arrow function?
authRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST: /api/signup');

  // Review: This is a long line, consider splitting it up into multiple ifs to give your frontend more specific feedback.

  // Review: Here's one way, I'm unconvinced I like it, but it's an option (or something similar).
  
  // const { username, password, email } = req.body;
  // const message = !username ? 'expected a username'
  //   : !password ? 'expected a password'
  //     : !email ? 'expected an email'
  //       : null;

  // if (message) return next(createError(400, message));
  
  if (!req.body.username || !req.body.email || !req.body.password) return next(createError(400, 'expected a request body username, email and password'));

  // Review: Any time you don't reassign a variable you can be using const
  // Review: const { password } = req.body;

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

// http -a briguy999:password1 :3000/api/signin
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
