'use strict';

const mongoose = require('mongoose');

const gameSchema = mongoose.Schema ({
  homeTeam: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team' },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team' },
  dateTime: { type: Date, required: true },
  weight: { type: String, default: 'regular' },
  homeScore: { type: Number, default: 0 },
  awayScore: { type: Number, default: 0 },
  status: { type: String, default: 'scheduled' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'team' },
  sportingEventID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'sportingEvent' },
  tags: { type: String },
});

module.exports = mongoose.model('gameSchema', gameSchema);