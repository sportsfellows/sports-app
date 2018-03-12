'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:profile-router');
const createError = require('http-errors');
const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Profile = require('../../model/user/profile.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = Router();

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({ dest: dataDir });

function s3uploadProm(params) {
  debug('s3uploadProm');

  return new Promise((resolve, reject) => { // eslint-disable-line
    s3.upload(params, (err, s3data) => {
      resolve(s3data);
    });
  });
}

profileRouter.post('/api/profile', bearerAuth, upload.single('image'), jsonParser, function (req, res, next) {
  debug('POST: /api/profile');

  req.body.userID = req.user._id;
  new Profile(req.body).save()
    .then(profile => res.json(profile))
    .catch(next);

  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path),
  };

  // kinda confused on how to include the image with the profile. do we need a pic model?
  // Profile.findById(req.user._id)
});

profileRouter.get('/api/profile/:profileId', bearerAuth, function (req, res, next) {
  debug('GET: /api/profile/:profileId');

  Profile.findById(req.params.profileId)
    .then(profile => res.json(profile))
    .catch(next);
});

profileRouter.put('/api/profile/:profileId', bearerAuth, jsonParser, function (req, res, next) {
  debug('PUT: /api/profile:profileId');

  if (!req.body) {
    return next(createError(400, 'request body not provided'));
  }

  Profile.findByIdAndUpdate(req.params.profileId, req.body, { new: true })
    .then(profile => res.json(profile))
    .catch(next);
});

// PUT route without a profileId
profileRouter.put('/api/profile', bearerAuth, jsonParser, function (req, res, next) {
  debug('PUT: /api/profile');

  return next(createError(400, 'profileId not provided'));
});

profileRouter.delete('/api/profile/:profileId', bearerAuth, function (req, res, next) {
  debug('DELETE: /api/profile/:profileId');

  Profile.findByIdAndRemove(req.params.profileId)
    .then(() => res.status(204).send())
    .catch(next);
});

// DELETE route without a profileId
profileRouter.delete('api/profile', bearerAuth, function (req, res, next) {
  debug('DELETE: /api/profile');

  return next(createError(400, 'profileId not provided'));
});