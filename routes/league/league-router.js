'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:league-router');
const createError = require('http-errors');

const League = require('../../model/league/league.js');
const MessageBoard = require('../../model/league/messageBoard.js');
const ScoreBoard = require('../../model/league/scoreBoard.js');
const UserPick = require('../../model/league/userPick.js');
const Profile = require('../../model/user/profile.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const leagueRouter = module.exports = Router();


// http POST :3000/api/sportingevent/5aa72ffd589c3d4ce00ed2aa/league 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjdjZjNjNTExYTIxZGUxNmUxZTM5MjBkZDNiNGI4NGZmOTJlZTZkMDA0OWRjMTMyOWZmMzkwYzNhZGUwYmYwZmMiLCJpYXQiOjE1MjA5OTQxODV9.ZdivKHeGH9rDklclxKal3u2GylQeDJiaor4f2bsWcpA' leagueName='aaaawfaaaaa' privacy='a' poolSize=0 scoring='regular'
leagueRouter.post('/api/sportingevent/:sportingeventId/league', bearerAuth, jsonParser, function(req, res, next) {
  debug(`POST: /api/sportingevent/:sportingeventId/league`);

  // Review: This line is wayyyyy too long
  if (!req.body.leagueName || !req.body.scoring || !req.body.poolSize || !req.body.privacy) return next(createError(400, 'expected a request body  leagueName, sportingeventID, owner, scoring, poolSize and privacy'));

  // Review: I'm assuming users is an array on your model, does it not need to be one here?
  req.body.owner = req.user._id;
  req.body.users = req.user._id;
  // Review: Id vs ID hurts me
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
      // Review: Why do you have the catch here vs at the end?
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( profile => {
          profile.leagues.push(league._id);
          return profile.save();
        });
    })
    .then( () => res.json(league))
    .catch(next);
});

// http PUT :3000/api/league/5aa757d3c73ef35216478a19/adduser 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjFjZjdjNDQwYTFkMmVhYTU3YTE1YmFmZDBmODA0NzFjZGFmNmUxY2FkZGVhYTA4YzE5M2E2NzkyM2JmMzY2ZDQiLCJpYXQiOjE1MjA5ODU0MjJ9.kdf9mPwEf8ROhg7iWfc8O-QxUXtK89D_-EL3goD0sWk'
leagueRouter.put('/api/league/:leagueId/adduser', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/league/:leagueId/adduser');

  return League.findById(req.params.leagueId)
    .then( league => {
      league.users.push(req.user._id);
      return league.save();
    })
    .then( (league) => {
      let scoreboard = { leagueID: league._id, userID: req.user._id };
      if (!scoreboard.leagueID || !scoreboard.userID ) return next(createError(400, 'expected a request body leagueID and userID'));
      return new ScoreBoard(scoreboard).save()
      // Review: Ditto above, re catch
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( (scoreBoard) => {
          return { scoreBoardLeague: scoreBoard.leagueID, scoreBoardUser: scoreBoard.userID, leagueUsers: league.users };
        });
    })
    .then( returnObj => {
      return Profile.findOne({ userID: req.user._id })
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( profile => {
          profile.leagues.push(req.params.leagueId);
          // Review: This is an async call and should be handled as such
          profile.save();
          returnObj.profileLeagues = profile.leagues;
          res.json(returnObj);
        });
    })
    .catch(next);
});

// http PUT :3000/api/league/5aa757d3c73ef35216478a19/removeuser 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjFjZjdjNDQwYTFkMmVhYTU3YTE1YmFmZDBmODA0NzFjZGFmNmUxY2FkZGVhYTA4YzE5M2E2NzkyM2JmMzY2ZDQiLCJpYXQiOjE1MjA5ODU0MjJ9.kdf9mPwEf8ROhg7iWfc8O-QxUXtK89D_-EL3goD0sWk'
leagueRouter.put('/api/league/:leagueId/removeuser', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/league/:leagueId/removeuser');

  return League.findById(req.params.leagueId)
    .then( league => {
      league.users.pull(req.user._id);
      return league.save();
    })
    .then( league => {
      return ScoreBoard.findOneAndRemove({ userID: req.user._id, leagueID: req.params.leagueId })
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( () => {
          return { scoreBoardResStatus: 204, leagueUsers: league.users };
        });
    })
    .then( returnObj => {
      // Review: Do you need the .exec()? What happens if you don't have it?
      return UserPick.remove({ userID: req.user._id, leagueID: req.params.leagueId }).exec()
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( () => {
          returnObj.scoreBoardResStatus = 204;
          return returnObj;
        });
    })
    .then( finalReturnObj => {
      return Profile.findOne({ userID: req.user._id })
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( profile => {
          profile.leagues.pull(req.params.leagueId);
          profile.save();
          finalReturnObj.profileLeagues = profile.leagues;
          res.json(finalReturnObj);
        });
    })
    .catch(next);
});

// http PUT :3000/api/league/5aa887b2d44b366965f91909 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjdjZjNjNTExYTIxZGUxNmUxZTM5MjBkZDNiNGI4NGZmOTJlZTZkMDA0OWRjMTMyOWZmMzkwYzNhZGUwYmYwZmMiLCJpYXQiOjE1MjA5OTQxODV9.ZdivKHeGH9rDklclxKal3u2GylQeDJiaor4f2bsWcpA'
leagueRouter.put('/api/league/:leagueId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/league/:leagueId');

  if (!req.body) return next(createError(400, 'expected a request body'));
  return League.findById(req.params.leagueId)
    .then( league => {
      // Review: Forbidden! Hell yeah!
      if(league.owner.toString() !== req.user._id.toString()) return next(createError(403, 'forbidden access'));
      League.findByIdAndUpdate(req.params.leagueId, req.body, {new: true})
        .then( league => res.json(league));
    })
    .catch(next);
});

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


// http DELETE :3000/api/league/5aa757d3c73ef35216478a19 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjBlOGUzNDZiMWMzYzllNzM0YjJhMzE4ZjMwMDA5NWNjZTFkNGQyNjA2OGM2ZTJhMzI4N2M1Y2MzZjFjMDI2M2IiLCJpYXQiOjE1MjA5OTY0OTh9.oicba8S1vhkLI4JLjn0ZZXa68cf-zoAQ6Noq9H6zTs0'
leagueRouter.delete('/api/league/:leagueId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/league/:leagueId');
  return League.findById(req.params.leagueId)
    .then( league => {
      if(league.owner.toString() !== req.user._id.toString()) return next(createError(403, 'forbidden access'));
      let profileUpdates = [];

      // Review: Instead of a forEach with a push, a map might be in order here
      league.users.forEach(function(luser) {
        profileUpdates.push(
          Profile.findOne({ userID: luser })
            .then( user => {
              user.leagues.pull(req.params.leagueId);
              return user.save();
            }));
      });
      return Promise.all(profileUpdates)
        .then( () => league.remove())
        .catch(next);
    })
    .then(() => res.status(204).send())
    .catch(next);
});
