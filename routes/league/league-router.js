'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:league-router');
const createError = require('http-errors');

const League = require('../../model/league/league.js');
const MessageBoard = require('../../model/league/messageBoard.js');
const ScoreBoard = require('../../model/league/scoreBoard.js');
// const User = require('../../model/user/user.js');
const Profile = require('../../model/user/profile.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const leagueRouter = module.exports = Router();

// http POST :3000/api/league 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjdjYWZmYTg1ZDlkZTM4YmM1ZTA5YjJhN2EyZWUyMzBiNWY0Y2ViM2UxYzM5MjE2YzNmMTUwNzUyZTVlMWUzMzMiLCJpYXQiOjE1MjA5MDQxNjB9.yhuxsiOaYoPtdCtYgGm8RHBjeQNfOIbSjbzCMSjIuQQ' leagueName='a' privacy='a' sportingEventID='5aa72ffd589c3d4ce00ed2aa' poolSize=0 scoring='regular'
leagueRouter.post('/api/sportingevent/:sportingeventId/league', bearerAuth, jsonParser, function(req, res, next) {
  debug(`POST: /api/sportingevent/:sportingeventId/league`);

  if (!req.body.leagueName || !req.body.scoring || !req.body.poolSize || !req.body.privacy) return next(createError(400, 'expected a request body  leagueName, sportingeventID, owner, scoring, poolSize and privacy'));
  req.body.owner = req.user._id;
  req.body.users = req.user._id;
  req.body.sportingEventID = req.params.sportingeventId;
 
  let league = new League(req.body).save()
    .then( myLeague => {
      league = myLeague;
      return new MessageBoard({ leagueID: league._id }).save();
    })
    .then( () => {
      let scoreboard = { leagueID: league._id, userID: req.user._id };
      if (!scoreboard.leagueID || !scoreboard.userID ) return next(createError(400, 'expected a request body leagueID and userID'));
      return new ScoreBoard(scoreboard).save();
    })
    .then( () => {
      return Profile.findOne({ userID: req.user._id })
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( profile => {
          profile.leagues.push(league._id);
          return profile.save();
        });
    })
    .then( () => res.json(league))
    .catch(next);
});

// http PUT :3000/api/league/5aa757d3c73ef35216478a19/adduser 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImIyMTM5ODllMTI5NmQ3YTYwNzk2ZDgxMmY1MDczYTljY2E4ZjU0MDE0OWVlOGI1MjkyYzZlNzRjZDE3MDg3MTUiLCJpYXQiOjE1MjA5ODI0NzN9.G3_nsq7jr6mXIHYjQ8Bb9a66evVsEFAgl5aZ_iYH_gM'
leagueRouter.put('/api/league/:leagueId/adduser', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/league/:leagueId/adduser');

  return League.findById(req.params.leagueId)
    .then( league => {
      league.users.push(req.user._id);
      return league.save();
    })
    .then( () => {
      return Profile.findOne({ userID: req.user._id })
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( profile => {
          profile.leagues.push(req.params.leagueId);
          return profile.save();
        });
    })
    .then( () => res.json(req.params.leagueId))
    .catch(next);
});

// leagueRouter.put('/api/league/:leagueId/adduser', bearerAuth, jsonParser, function(req, res, next) {
//   debug('PUT: /api/league/:leagueId/adduser');

//   return Profile.findOne({ userID: req.user._id })
//     .catch( err => Promise.reject(createError(404, err.message)))
//     .then( profile => {
//       profile.leagues.push(req.params.leagueId);
//       return profile.save();
//     })
//     .then( () => {
//       return League.findById(req.params.leagueId)
//         .then( league => {
//           league.users.push(req.user._id);
//           return league.save();
//         });
//     })
//     .catch(next);
// });

leagueRouter.get('/api/league/:leagueId', bearerAuth, function(req, res, next) {
  debug('GET: /api/league/:leagueId');

  League.findById(req.params.leagueId)
    .then( league => res.json(league))
    .catch(next);
});

leagueRouter.get('/api/leagues', bearerAuth, function(req, res, next) {
  debug('GET: /api/leagues');

  League.find()
    .then(leagues => res.json(leagues))
    .catch(next);
});



leagueRouter.delete('/api/league/:leagueId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/league/:leagueId');

  League.findByIdAndRemove(req.params.leagueId)
    .then( () => res.status(204).send())
    .catch(next);
});