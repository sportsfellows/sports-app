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

// http POST :3000/api/sportingevent/5aa72ffd589c3d4ce00ed2aa/game 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjdjZjNjNTExYTIxZGUxNmUxZTM5MjBkZDNiNGI4NGZmOTJlZTZkMDA0OWRjMTMyOWZmMzkwYzNhZGUwYmYwZmMiLCJpYXQiOjE1MjA5OTQxODV9.ZdivKHeGH9rDklclxKal3u2GylQeDJiaor4f2bsWcpA' homeTeam='5aa8c322091555739d8cb12c' awayTeam='5aa8c340091555739d8cb12d' dateTime='2018-03-13 23:37:52-0700'
gameRouter.post('/api/sportingevent/:sportingeventId/game', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/sportingevent/:sportingeventId/game');
  
  if (!req.body.homeTeam || !req.body.awayTeam || !req.body.dateTime ) return next(createError(400, 'expected a request body homeTeam, awayTeam and dateTime'));
  req.body.sportingEventID = req.params.sportingeventId;
  
  new Game(req.body).save()
    .then( game => res.json(game))
    .catch(next);
  // .then( newGame => game = newGame)
  // .then( () => {
  //   let leagueObjArr = [];
  //   League.find({ sportingEventID: req.params.sportingeventId })
  //     .then( leagues => {
  //       leagues.forEach(league => {
  //         // leagueObjArr.push({ leagueID: league._id, userIDS: league.users, gameID: game._id, gameTime: game.dateTime })
  //         leagueObjArr.push({ leagueID: league._id, userIDS: league.users })
  //       })return leagueObjArr.push({ leagues._id, users: leagues.users})
  //     })
  // })
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

gameRouter.put('/api/game/:gameId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/game:gameId');

  if (!req.body) return next(createError(400, 'expected a request body'));
  let game = Game.findByIdAndUpdate(req.params.gameId, req.body, {new: true})
    .then( updatedGame => {
      if(!req.body.winner) res.json(updatedGame);
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
            if(userPick.pick == game.winner) {
              userPick.correct = true;
              userPick.save();
              scoreBoard2Update.push(
                ScoreBoard.findOne({ userID: userPick.userID, leagueID: userPick.leagueID })
                  .then( newscoreBoard => {
                    newscoreBoard.score += (1 * game.weight);
                    return newscoreBoard.save();
                  }));
            }           
            else { 
              userPick.correct = false;
              return userPick.save();
            }
          });
        });
    })
    .catch(next);
});

// League.find({ sportingEventID: req.params.sportingeventId })
//     .then( leagues => {
//       leagues.forEach(league => {
//         // leagueObjArr.push({ leagueID: league._id, userIDS: league.users, gameID: game._id, gameTime: game.dateTime })
//         leagueObjArr.push({ leagueID: league._id, userIDS: league.users })
//       })return leagueObjArr.push({ leagues._id, users: leagues.users})
//     })