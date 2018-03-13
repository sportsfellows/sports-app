'use strict';

const mongoose = require('mongoose');

const messageBoardSchema = mongoose.Schema({
  leagueID: { type: mongoose.Schema.Types.ObjectId, ref: 'league' },
  groupID: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
  tags: {type: String },
});

module.exports = mongoose.model('messageBoard', messageBoardSchema);