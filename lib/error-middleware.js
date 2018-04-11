'use strict';

const createError = require('http-errors');
const debug = require('debug')('sportsapp:error-middleware');

module.exports = function(err, req, res, next) {
  debug('error-middleware');

  // Review: Take out corpse code
  // console.log('message:', err.message);
  // console.log('name:', err.name);

  if (err.status) {
    res.status(err.status).send(err.name);
    next();
    return;
  }

  if (err.name === 'validationError') {
    err = createError(400, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  // Review: Good to see you check for an additional case. I would encourage you to add even more cases.
  // Review: Mongoose throws a bunch of funky errors, and if you can find what they are you can handle them
  if (err.name === 'CastError') {
    err = createError(404, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  next();
};
