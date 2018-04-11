'use strict';

const createError = require('http-errors');
const debug = require('debug')('sportsapp:basic-auth-middleware');

module.exports = function(req, res, next) {
  debug('basic auth');
  // Review: const
  var authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError(401, 'authorization header required'));
  }
  // Review: const
  var base64str = authHeader.split('Basic ')[1];
  if (!base64str) {
    return next(createError(401, 'username and password required'));
  }

  // Review: Check out this es6 butter:
  // const [username, password] = Buffer.from(base64str, 'base64')
  //   .toString().split(':');
  // Review: now username and password are variables you can use directly;
  var utf8str = Buffer.from(base64str, 'base64').toString();
  var authArr = utf8str.split(':');

  // Review: I would argue that it makes more sense to do this after you've checked that they exist
  req.auth = {
    username: authArr[0],
    password: authArr[1],
  };
  
  if (!req.auth.username) {
    return next(createError(401, 'username required'));
  }

  if (!req.auth.password) {
    return next(createError(401, 'password required'));
  }

  next();
};
