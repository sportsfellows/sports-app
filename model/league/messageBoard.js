'use strict';

const mongoose = require('mongoose');

const messageBoardSchema = mongoose.Schema({
  leagueID: { type: mongoose.Schema.Types.ObjectId },
  groupID: { type: mongoose.Schema.Types.ObjectId },
  tags: {type: String },
});

module.exports = mongoose.model('messageBoard', messageBoardSchema);