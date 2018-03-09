'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = Schema({
  name: { type: String, require: true, unique: true},
  sportingEventID: { type: Schema.Types.ObjectId, required: true },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('team', teamSchema);