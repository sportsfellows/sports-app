'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = Schema ({
  home: { type: Schema.Types.ObjectId, required: true },
  away: { type: Schema.Types.ObjectId, required: true },
  weight: { type: Number},
  winner: { type: Schema.Types.ObjectId, default: null },
  homeScore: { type: Number, default: null},
  awayScore: { type: Number, default: null},
  dateTime: { type: Date, default: null, required: true },
});

module.exports = mongoose.model('gameSchema', gameSchema);