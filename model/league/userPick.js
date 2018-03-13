'use strict';

const mongoose = require('mongoose');

const userPickSchema = mongoose.Schema({
  profileID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'profile' },
  leagueID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'league' },
  gameID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'game' },
  pick: { type: mongoose.Schema.Types.ObjectId, ref: 'team' },
});

module.exports = mongoose.model('userPick', userPickSchema);