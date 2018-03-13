'use strict';

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  profileID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'profile' },
  messageBoardID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'messageBoard' },
  content: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  tags: { type: String },
});

module.exports = mongoose.model('comment', commentSchema);