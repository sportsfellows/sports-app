'use strict';

const mongoose = require('mongoose');

const scoreBoardSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  leagueID: { type: mongoose.Schema.Types.ObjectId, required: true },
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model('scoreBoard', scoreBoardSchema);