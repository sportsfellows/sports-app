'use strict';

const mongoose = require('mongoose');

const userPickSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  leagueID: { type: mongoose.Schema.Types.ObjectId, required: true },
  gameID: { type: mongoose.Schema.Types.ObjectId, required: true },
  pick: { type: mongoose.Schema.Types.ObjectId },
});

module.exports = mongoose.model('userPick', userPickSchema);