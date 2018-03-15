'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const debug = require('debug')('sportsapp:profile');
const createError = require('http-errors');
// const User = require('./user.js');
// const League = require('../league/league.js');
// const Group = require('../league/group.js');

const profileSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  username: {type: String, required: true },
  image: { type: String },
  country: { type: String, uppercase: true },
  state: { type: String, uppercase: true },
  birthdate: { type: Number }, //(mmddyyyy);
  accountBalance: { type: Number, default: 0 },
  status: { type: String, default: 'active'},
  createdOn: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  leagues: [{type: mongoose.Schema.Types.ObjectId, ref: 'league'}],
  groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'group'}],
  tags: [{type: String }],
});

const Profile = module.exports = mongoose.model('profile', profileSchema);

Profile.findByuserIDAndAddLeague = function(uid, lid) {
  debug('findByuserIDAndAddLeague');
  return Profile.findOne({ userID: uid })
    .catch( err => Promise.reject(createError(404, err.message)))
    .then( profile => {
      profile.leagues.push(lid);
      return profile.save();
    });
};