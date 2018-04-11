'use strict';

const debug = require('debug')('sportsapp:server-toggle');
const mongoose = require('mongoose');

module.exports = exports = {};

// Review: I would encourage you to look into a promisified server model. 
// Review: I think it is better for testability. Take a look at the sluggram backend for ideas
exports.serverOn = function(server, done) {
  if (!server.isRunning) {
    server.listen(process.env.PORT, () => {
      server.isRunning = true;
      debug('server is rizzunning');
      done();
    });
    return;
  }
  done();
};

exports.serverOff = function(server, done) {
  if (server.isRunning) {
    server.close( err => {
      if (err) return done(err);
      server.isRunning = false;
      mongoose.connection.close();
      debug('server is dizzizown');
      done();
    });
    return;
  }
  done();
};
