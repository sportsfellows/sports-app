'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:profile-router');
const createError = require('http-errors');

const SportingEvent = require('../../model/sportingEvent/sportingEvent.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const sportingEventRouter = module.exports = Router();

sportingEventRouter.post('/api/sportingevent', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/sportingEvent');

  if (!req.body.sportingEventName || !req.body.desc ) return next(createError(400, 'expected a request body name and desc'));
  new SportingEvent(req.body).save()
    .then( sportingEvent => res.json(sportingEvent))
    .catch(next);
});

sportingEventRouter.get('/api/sportingevent/:sportingEventId', bearerAuth, function(req, res, next) {
  debug('GET: /api/sportingEvent/:sportingEventId');

  SportingEvent.findById(req.params.sportingEventId)
    .then( sportingEvent => res.json(sportingEvent))
    .catch(next);
});

sportingEventRouter.put('/api/sportingevent/:sportingEventId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/sportingEvent:sportingEventId');

  // TO DO: CREATE 400 ERROR IF NO REQ BODY
  // TO DO: CREATE 400 ERROR IF NO SPORTING EVENT ID

  SportingEvent.findByIdAndUpdate(req.params.sportingEventId, req.body, {new: true})
    .then( sportingEvent => res.json(sportingEvent))
    .catch(next);
});


sportingEventRouter.delete('/api/sportingevent/:sportingEventId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/sportingEvent/:sportingEventId');

  // TO DO: CREATE 400 ERROR IF NO SPORTING EVENT ID

  SportingEvent.findByIdAndRemove(req.params.sportingEventId)
    .then( () => res.status(204).send())
    .catch(next);
});