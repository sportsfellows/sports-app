'use strict';

const express = require('express');
const debug = require('debug')('sportsapp:server');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const morgan = require('morgan');
const cors = require('cors');

const fakeUser = require('./__test__/lib/fakeUser.js');
const leagueRouter = require('./routes/league/league-router.js');
const groupRouter = require('./routes/league/group-router.js');
const scoreBoardRouter = require('./routes/league/scoreBoard-router.js');
const userPickRouter = require('./routes/league/userPick-router.js');
const gameRouter = require('./routes/sportingEvent/game-router.js');
const sportingEventsRouter = require('./routes/sportingEvent/sportingEvent-router.js');
const teamRouter = require('./routes/sportingEvent/team-router.js');
const authRouter = require('./routes/user/auth-router.js');
const profileRouter = require('./routes/user/profile-router.js');
const messageBoardRouter = require('./routes/league/messageBoard-router.js');
const commentRouter = require('./routes/league/comment-router.js');
const errors = require('./lib/error-middleware.js');
dotenv.load();

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(authRouter);
app.use(profileRouter);
app.use(sportingEventsRouter);
app.use(gameRouter);
app.use(teamRouter);
app.use(leagueRouter);
app.use(userPickRouter);
app.use(scoreBoardRouter);
app.use(groupRouter);
app.use(messageBoardRouter);
app.use(commentRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  fakeUser.create().then(console.log);
  debug(`cf madness is running on: ${PORT}`);
});



server.isRunning = true;