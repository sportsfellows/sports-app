'use strict';

const mongoose = require('mongoose');

const scoreBoardSchema = mongoose.Schema({
  profileID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'profile' },
  leagueID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'league' },
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model('scoreBoard', scoreBoardSchema);