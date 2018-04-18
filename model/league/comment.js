'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const commentSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  username: {type: String, required: true },
  image: { type: String },
  messageBoardID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'messageBoard' },
  content: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  tags: [{type: String }],
});

module.exports = mongoose.model('comment', commentSchema);