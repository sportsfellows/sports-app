'use strict';

const mongoose = require('mongoose');

const scoreBoardSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  leagueID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'league' },
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model('scoreBoard', scoreBoardSchema);