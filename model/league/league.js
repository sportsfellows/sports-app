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
  ownerName: {type: String, required: true },
  scoring: { type: String, required: true},
  poolSize: { type: Number, required: true },
  privacy: { type: String, default: 'public', required: true },
  password: { type: String },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  status: { type: String, default: 'active' },
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  createdOn: { type: Date, default: Date.now },
  size: { type: Number, default: 1 },
  paidUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  tags: [{type: String }],
});

leagueSchema.pre('remove', function(next) {
  MessageBoard.findOne({ leagueID: this._id })
    .then( messageBoard => {
      Comment.remove({messageBoardID: messageBoard._id}).exec();
    })
    .catch(next);
  MessageBoard.remove({leagueID: this._id}).exec();
  ScoreBoard.remove({leagueID: this._id}).exec();
  UserPick.remove({leagueID: this._id}).exec();
  next();
});

module.exports = mongoose.model('league', leagueSchema);

