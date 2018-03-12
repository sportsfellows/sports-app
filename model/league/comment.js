'use strict';

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  messageBoardID: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  tags: { type: String },
});

module.exports = mongoose.model('comment', commentSchema);