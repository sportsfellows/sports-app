'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const debug = require('debug')('sportsapp:profile');
const createError = require('http-errors');

const profileSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  username: {type: String, required: true },
  image: { type: String },
  // Review: If you have no extra properties, you can just say image: String,
  country: { type: String, uppercase: true },
  state: { type: String, uppercase: true },
  // Review: How do you handle this date? Do you have checks on it?
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
    // Review: You should put this after your catch
    // Review: I would argue that if your code breaks here and goes to this catch it would not be a 404, but a 400
    .catch( err => Promise.reject(createError(404, err.message)))
    .then( profile => {
      profile.leagues.push(lid);
      return profile.save();
    });
};
