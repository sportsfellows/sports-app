'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const MessageBoard = require('./messageBoard.js');
const Comment = require('./comment.js');
const ScoreBoard = require('./scoreBoard.js');
const UserPick = require('./userPick.js');

const leagueSchema = mongoose.Schema({
  leagueName: { type: String, required: true },
  sportingEventID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'sportingEvent' },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  scoring: { type: String, required: true},
  poolSize: { type: Number, required: true },
  privacy: { type: String, required: true },
  password: { type: String },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  status: { type: String, default: 'active' },
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  createdOn: { type: Date, default: Date.now },
  size: { type: Number, default: 0 },
  paidUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  tags: [{type: String }],
});

// Review: SUPER awesome that you figured out how to use these 'pre' hooks. Way to go!
// Review: Did you discover the 'post' hooks as well?
leagueSchema.pre('remove', function(next) {
  MessageBoard.findOne({ leagueID: this._id })
    .then( messageBoard => {
      Comment.remove({messageBoardID: messageBoard._id}).exec();
    })
    .catch(next);
  // Review: What happens if any of these async calls fail?
  // Review: Are any of them linked? Should they be handled in a promise chain instead?
  MessageBoard.remove({leagueID: this._id}).exec();
  ScoreBoard.remove({leagueID: this._id}).exec();
  UserPick.remove({leagueID: this._id}).exec();
  next();
});

module.exports = mongoose.model('league', leagueSchema);

