'use strict';

const mongoose = require('mongoose');

const gameSchema = mongoose.Schema ({
  homeTeam: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team' },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team' },
  dateTime: { type: Date, required: true },
  weight: { type: Number, default: 1 },
  homeScore: { type: Number, default: 0 },
  awayScore: { type: Number, default: 0 },
  status: { type: String, default: 'scheduled' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'team' },
  loser: { type: mongoose.Schema.Types.ObjectId, ref: 'team' },
  sportingEventID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'sportingEvent' },
  tags: [{type: String }],
});

// Review: Maybe use the name 'game' instead of 'gameSchema'?
module.exports = mongoose.model('gameSchema', gameSchema);
