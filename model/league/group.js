'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const MessageBoard = require('./messageBoard.js');
const Comment = require('./comment.js');

const groupSchema = mongoose.Schema({
  groupName: { type: String, required: true },
  privacy: { type: String, required: true },
  size: { type: Number, default: 0 },
  motto: { type: String },
  createdOn: { type: Date, default: Date.now },
  image: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  password: { type: String },
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  tags: [{type: String }], 
});

groupSchema.pre('remove', function(next) {
  MessageBoard.findOne({ groupID: this._id })
    .then( messageBoard => {
      Comment.remove({messageBoardID: messageBoard._id}).exec();
    })
    .catch(next);
  MessageBoard.remove({groupID: this._id}).exec();
  next();
});

module.exports = mongoose.model('group', groupSchema);