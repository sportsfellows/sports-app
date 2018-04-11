'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:game-router');
const createError = require('http-errors');

const Team = require('../../model/sportingEvent/team.js');
const Game = require('../../model/sportingEvent/game.js');
const ScoreBoard = require('../../model/league/scoreBoard.js');
const UserPick = require('../../model/league/userPick.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const gameRouter = module.exports = Router();

// Review: remove...
// http POST :3000/api/sportingevent/5aa72ffd589c3d4ce00ed2aa/game 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjdjZjNjNTExYTIxZGUxNmUxZTM5MjBkZDNiNGI4NGZmOTJlZTZkMDA0OWRjMTMyOWZmMzkwYzNhZGUwYmYwZmMiLCJpYXQiOjE1MjA5OTQxODV9.ZdivKHeGH9rDklclxKal3u2GylQeDJiaor4f2bsWcpA' homeTeam='5aa8c322091555739d8cb12c' awayTeam='5aa8c340091555739d8cb12d' dateTime='2018-03-13 23:37:52-0700'
gameRouter.post('/api/sportingevent/:sportingeventId/game', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/sportingevent/:sportingeventId/game');
  
  // Review: definitely a good spot for some es6 destructuring
  if (!req.body.homeTeam || !req.body.awayTeam || !req.body.dateTime ) return next(createError(400, 'expected a request body homeTeam, awayTeam and dateTime'));
  req.body.sportingEventID = req.params.sportingeventId;
  
  new Game(req.body).save()
    .then( game => res.json(game))
    .catch(next);
});

gameRouter.get('/api/game/:gameId', bearerAuth, function(req, res, next) {
  debug('GET: /api/game/:gameId');

  Game.findById(req.params.gameId)
    .then( game => res.json(game))
    .catch(next);
});

gameRouter.get('/api/games', bearerAuth, function(req, res, next) {
  debug('GET: /api/games');

  Game.find()
    .then(games => res.json(games))
    .catch(next);
});

// http PUT :3000/api/game/5aaa8ae6f2db6d1315d2934a 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImNiZTQzODQwMTBiZmJjN2I2NDJiNTlkZTM1ZjgxMDE3NDhlMTA3MDJmNmU3NmExZWEzOGJmN2M3ZWY2NDUyODUiLCJpYXQiOjE1MjExMjU4Njd9.4p5DqkayofQHjCbHYzSDr8FPexGFcdtJCsM8gTc3maU' gameID='5aaa8ae6f2db6d1315d2934a' winner='5aa8c322091555739d8cb12c' loser='5aa8c340091555739d8cb12d' homeScore=50 awayScore=40 status='played'

// Review: This route has SO much logic in it. It could be cleaned up quite a bit by using methods on your models. I like to add helper functions to the models directly to handle the logic I know I will need in my route. For example, a method to increment the wins or losses. Tiny little abstractions like that can result in much cleaner routes.

// Review: Nice job getting this working, so many handshakes that need to happen correctly. That's a lot to manage.
gameRouter.put('/api/game/:gameId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/game/:gameId');

  if (!req.body) return next(createError(400, 'expected a request body'));
  let game = Game.findByIdAndUpdate(req.params.gameId, req.body, {new: true})
    .then( updatedGame => {
      // Review: This looks problematic. By calling res.json here you are ending the connection with the client
      // Review: But you have another res.send('success') down below which could result in a "write after end" error
      if(!req.body.winner) res.json(updatedGame);
      // Review: I think returning assignments like this is frowned upon (at least according to my linter)
      // Review: And you aren't using it in the next game, so you don't need to return it.
      return game = updatedGame;
    })
    .then( () => {
      Team.findById(game.winner)
        .then( team => {
          team.wins = team.wins + 1;
          return team.save();
        })
        .catch(next);
    })
    .then( () => {
      Team.findById(game.loser)
        .then( team => {
          team.losses = team.losses + 1;
          return team.save();
        })
        .catch(next);
    })
    .then ( () => {
      UserPick.find({ gameID: req.params.gameId })
        .then( userPicks => {
          let scoreBoard2Update = [];
          userPicks.forEach(function(userPick) {
            if(userPick.pick.toString() == game.winner.toString()) {
              userPick.correct = true;
              // Review: userPick.save() is an async call and should be treated as such or you could run into issues
              userPick.save();
              scoreBoard2Update.push(
                // Review: findOne is also async, and should be handled as such
                ScoreBoard.findOne({ userID: userPick.userID, leagueID: userPick.leagueID })
                  .then( newscoreBoard => {
                    // Review: the 1 * isn't doing anything says the math teacher :-)
                    newscoreBoard.score += (1 * game.weight);
                    return newscoreBoard.save();
                  }));
            }           
            else { 
              userPick.correct = false;
              return userPick.save();
            }
            return Promise.all(scoreBoard2Update)
              .catch(next);
          });
        });
    })
    .then(() => res.send('success'))
    .catch(next);
});
