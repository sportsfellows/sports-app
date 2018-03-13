'use strict';

const mongoose = require('mongoose');

const leagueSchema = mongoose.Schema({
  leagueName: { type: String, required: true },
  sportingEventID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'sportingEvent' },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'profile' },
  scoring: { type: String, required: true},
  poolSize: { type: Number, required: true },
  privacy: { type: String, required: true },
  password: { type: String },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'profile' },
  status: { type: String, default: 'active' },
  profiles: [{type: mongoose.Schema.Types.ObjectId, ref: 'profile'}],
  createdOn: { type: Date, default: Date.now },
  size: { type: Number, default: 0 },
  paidProfiles: [{type: mongoose.Schema.Types.ObjectId, ref: 'profile'}],
  tags: { type: String },
});

module.exports = mongoose.model('league', leagueSchema);