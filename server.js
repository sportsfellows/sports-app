'use strict';

const express = require('express');
const debug = require('debug')('sportsapp:server');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

// const leagueRouter = require('./routes/league/league-router.js');
// const scoreboardRouter = require('./routes/league/scoreboard-router.js');
// const userPickRouter = require('./routes/league/user-pick-router.js');
// const gameRouter = require('./routes/sportingEvents/game-router.js');
// const sportingEventsRouter = require('./routes/sportingEvents/sporting-events-router.js');
// const teamRouter = require('./routes/sportingEvents/sporting-events-router.js');
const authRouter = require('./routes/user/auth-router.js');
// const profileRouter = require('./routes/user/profile-router.js');
const errors = require('./lib/error-middleware.js');
dotenv.load();

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(authRouter);
// app.use(profileRouter);
// app.use(sportingEventsRouter);
// app.use(gameRouter);
// app.use(teamRouter);
// app.use(leagueRouter);
// app.use(userPickRouter);
// app.use(scoreboardRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`cf madness is running on: ${PORT}`);
});

server.isRunning = true;