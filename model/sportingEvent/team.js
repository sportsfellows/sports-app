'use strict';

const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  teamName: { type: String, required: true, unique: true},
  sportingEventID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'sportingEvent' },
  createdOn: { type: Date, default: Date.now },
  seed: { type: Number },
  wins: {type: Number, default: 0 },
  losses: {type: Number, default: 0 },
  // Review: preTournamentRecord: String,
  pretournamentRecord: {type: String},
  tags: [{type: String }],
});

module.exports = mongoose.model('team', teamSchema);
