'use strict';

// Review: I prefer loading my dotenv immediately
require('dotenv').load();
const express = require('express');
const debug = require('debug')('sportsapp:server');
const mongoose = require('mongoose');

// Review: No need to change Mongoose's promise with mongoose 5.x.x

const morgan = require('morgan');
const cors = require('cors');

// Review: This is a LOT of imports that are making your server file congested. 
// Review: Instead, abstract this to a separate routes module and setup in a router.
// Review: Set it up similar to the following:
// module.exports = new Router()
//   .use([
//     leagueRouter,
//     groupRouter,
//     .
//     .
//     .
//   ]);

// Review: Then you can just use this one middleware router and it will contain all of your routes, clean!!!

// Review: Schwoop for days.

const errors = require('./lib/error-middleware.js');
const authRouter = require('./routes/user/auth-router.js');
const groupRouter = require('./routes/league/group-router.js');
const profileRouter = require('./routes/user/profile-router.js');
const leagueRouter = require('./routes/league/league-router.js');
const commentRouter = require('./routes/league/comment-router.js');
const gameRouter = require('./routes/sportingEvent/game-router.js');
const teamRouter = require('./routes/sportingEvent/team-router.js');
const userPickRouter = require('./routes/league/userPick-router.js');
const scoreBoardRouter = require('./routes/league/scoreBoard-router.js');
const messageBoardRouter = require('./routes/league/messageBoard-router.js');
const sportingEventsRouter = require('./routes/sportingEvent/sportingEvent-router.js');

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
// Review: The middleware tip above would remove all of this, making it cleaner
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
  debug(`cf madness is running on: ${PORT}`);
});

server.isRunning = true;
