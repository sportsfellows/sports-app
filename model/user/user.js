'use strict';

// Review: Add more helper methods to your model to clean your routes up. For example, add a User.create method

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const createError = require('http-errors');
const Promise = require('bluebird'); // Review: Almost perfect schwoop :-/
const debug = require('debug')('sportsapp:user');

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true },
  findHash: { type: String, unique: true },
});

userSchema.methods.generatePasswordHash = function(password) {
  debug('generate password hash');

  // Review: bcrypt.hash() actually returns a promise, so you can chain directly on it.
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if(err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.comparePasswordHash = function(password) {
  debug('comparePasswordHash');

  // Review: Same deal here, this already returns a promise
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err);
      if(!valid) return reject(createError(401, 'invalid password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateFindHash = function() {
  debug('generateFindHash');

  return new Promise((resolve, reject) => {
    let tries = 0;

    _generateFindHash.call(this);

    function _generateFindHash() {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
        .then( () => resolve(this.findHash))
        // Review: err=> vs err =>
        .catch( err=> {
          if(tries > 3) return reject(err);
          tries++;
          // Review: If you had written this with an arrow function you wouldn't need to use .call here
          _generateFindHash.call(this);
        });
    }
  });
};

userSchema.methods.generateToken = function() {
  debug('generateToken');

  // Review: generateFindHash returns a promise, so you don't need to define one here. 
  // Review: The two lines below accomplish the exact same thing as your 5 lines of code
  // Review: Notice that I don't even have the catch, cause it will get handled in your routes

  // return this.generateFindHash()
  //   .then(findHash => jwt.sign({ token: findHash }, process.env.APP_SECRET));

  return new Promise((resolve, reject) => {
    this.generateFindHash()
      .then( findHash => resolve(jwt.sign({ token: findHash}, process.env.APP_SECRET)))
      .catch( err => reject(err));
  });
};

module.exports = mongoose.model('user', userSchema);
