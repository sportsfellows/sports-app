'use strict';

const mongoose = require('mongoose');

const gameSchema = mongoose.Schema ({
  homeTeam: { type: mongoose.Schema.Types.ObjectId, required: true },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, required: true },
  dateTime: { type: Date, required: true },
  weight: { type: String, default: 'regular' },
  homeScore: { type: Number, default: 0 },
  awayScore: { type: Number, default: 0 },
  status: { type: String, default: 'scheduled' },
  winner: { type: mongoose.Schema.Types.ObjectId },
  tags: { type: String },
});

module.exports = mongoose.model('gameSchema', gameSchema);