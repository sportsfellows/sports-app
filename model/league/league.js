'use strict';

const mongoose = require('mongoose');

const leagueSchema = mongoose.Schema({
  leagueName: { type: String, required: true },
  sportingEventID: { type: mongoose.Schema.Types.ObjectId, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  scoring: { type: String, required: true},
  poolSize: { type: Number, required: true },
  privacy: { type: String, required: true },
  password: { type: String },
  winner: { type: mongoose.Schema.Types.ObjectId },
  status: { type: String, default: 'active' },
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  createdOn: { type: Date, default: Date.now },
  size: { type: Number, default: 0 },
  paidUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  tags: { type: String },
});

module.exports = mongoose.model('league', leagueSchema);