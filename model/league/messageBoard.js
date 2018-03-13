'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('sportsapp:messageBoard');
const createError = require('http-errors');
const Comment = require('./comment.js');

const messageBoardSchema = mongoose.Schema({
  leagueID: { type: mongoose.Schema.Types.ObjectId, ref: 'league' },
  groupID: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
  tags: [{type: String }],
});

const MessageBoard = module.exports = mongoose.model('messageBoard', messageBoardSchema);

MessageBoard.findByIdAndAddComment = function(id, comment) {
  debug('findbyidandaddcomment');

  return MessageBoard.findById(id)
    .catch( err => Promise.reject(createError(404, err.message)))
    .then( messageBoard => {
      comment.messageBoardID = messageBoard._id;
      this.tempMessageBoard = messageBoard;
      return new Comment(comment).save();
    })
    .then( comment => {
      this.tempMessageBoard.comments.push(comment._id);
      this.tempComment = comment;
      return this.tempMessageBoard.save();
    })
    .then( () => {
      return this.tempComment;
    });
};