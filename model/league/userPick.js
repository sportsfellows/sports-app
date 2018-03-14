'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const userPickSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  leagueID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'league' },
  gameID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'game' },
  pick: { type: mongoose.Schema.Types.ObjectId, required: true },
  correct: {type: Boolean },
  gameTime: { type: Date, required: true },
});

module.exports = mongoose.model('userPick', userPickSchema);