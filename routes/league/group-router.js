'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:group-router');
const createError = require('http-errors');

const Group = require('../../model/league/group.js');
const Profile = require('../../model/user/profile.js');
const MessageBoard = require('../../model/league/messageBoard.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const groupRouter = module.exports = Router();

// http POST :3000/api/group 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6Ijk3OTZmOGMzNjI2NDhhMDM0YzNkMzg1YmU4MjIyNTFkZTUyYTBmNTY4NWI5ZDM4ODg3NTNkMjUwZjljMjFhODkiLCJpYXQiOjE1MjEwMDQ3OTB9.I_xZOfe87-EQWz_vnHzHCSO26bWtarNeheEM18I_wEA' groupName='newgroupasfd' privacy='aewf'
groupRouter.post('/api/group', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/group');

  if (!req.body.groupName || !req.body.privacy) return next(createError(400, 'expected a request body groupName, privacy'));
  req.body.owner = req.user._id;
  req.body.users = req.user._id;
  req.body.ownerName = req.user.username;
 
  let group = new Group(req.body).save()
    .then( myGroup => {
      group = myGroup;
      return new MessageBoard({ groupID: group._id }).save();
    })
    .then( () => {
      return Profile.findOne({ userID: req.user._id })
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( profile => {
          profile.groups.push(group._id);
          return profile.save();
        });
    })
    .then( () => res.json(group))
    .catch(next);
}); 

// http PUT :3000/api/group/5aa8b142eb28637009a35fe3/adduser 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjZiZjIwNzZkOWI0MThlMTcwN2VjNzU1NWY3MWM2YTRhYTQxYThlYjJhZmZmZjg3YzEzNzlmMjhiMjgxZDUzNTQiLCJpYXQiOjE1MjEwMDUwNjF9.QFL8nK6rS-_sDfD9XdZFhXcnXR75zMdKNKTjQl_8T_4'
groupRouter.put('/api/group/:groupId/adduser', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/group/:groupId/adduser');

  return Group.findById(req.params.groupId)
    .then( group => {
      group.users.push(req.user._id);
      group.size = group.size + 1;
      return group.save();
    })
    .then( group => {
      return Profile.findOne({ userID: req.user._id })
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( profile => {
          profile.groups.push(req.params.groupId);
          profile.save();
          // let returnObj = { groupUsers: group.users, profileGroups: profile.groups };
          // res.json(returnObj);
          res.json(group);
        });
    })
    .catch(next);
});

// add user to private group
groupRouter.post('/api/group/private/adduser', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/group/private/adduser');
  console.log('req.body: ', req.body);

  return Group.findOne({ groupName: req.body.groupName, password: req.body.password })
    .then( group => {
      group.users.push(req.user._id);
      group.size = group.size + 1;
      return group.save();
    })
    .then( group => {
      return Profile.findOne({ userID: req.user._id })
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( profile => {
          profile.groups.push(req.params.groupId);
          profile.save();
          // let returnObj = { groupUsers: group.users, profileGroups: profile.groups };
          // res.json(returnObj);
          res.json(group);
        });
    })
    .catch(next);
});

// http PUT :3000/api/group/5aa8b142eb28637009a35fe3/removeuser 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjZiZjIwNzZkOWI0MThlMTcwN2VjNzU1NWY3MWM2YTRhYTQxYThlYjJhZmZmZjg3YzEzNzlmMjhiMjgxZDUzNTQiLCJpYXQiOjE1MjEwMDUwNjF9.QFL8nK6rS-_sDfD9XdZFhXcnXR75zMdKNKTjQl_8T_4'
groupRouter.put('/api/group/:groupId/removeuser', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/group/:groupId/removeuser');

  return Group.findById(req.params.groupId)
    .then( group => {
      group.users.pull(req.user._id);
      group.size = group.size - 1;
      return group.save();
    })
    .then( group => {
      return Profile.findOne({ userID: req.user._id })
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( profile => {
          profile.groups.pull(req.params.groupId);
          profile.save();
          let returnObj = { groupUsers: group.users, profileGroups: profile.groups };
          res.json(returnObj);
        });
    })
    .catch(next);
});

// http PUT :3000/api/group/5aa8b142eb28637009a35fe3 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6Ijk3OTZmOGMzNjI2NDhhMDM0YzNkMzg1YmU4MjIyNTFkZTUyYTBmNTY4NWI5ZDM4ODg3NTNkMjUwZjljMjFhODkiLCJpYXQiOjE1MjEwMDQ3OTB9.I_xZOfe87-EQWz_vnHzHCSO26bWtarNeheEM18I_wEA'
groupRouter.put('/api/group/:groupId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/group/:groupId');
  let groupProperties = req.body.groupName || req.body.privacy || req.body.size || req.body.motto || req.body.createdOn || req.body.image || req.body.owner || req.body.password || req.body.users || req.body.tags;
  if (!groupProperties) return next(createError(400, 'expected a request body'));
  return Group.findById(req.params.groupId)
    .then( group => {
      if(group.owner.toString() !== req.user._id.toString()) return next(createError(403, 'forbidden access'));
      Group.findByIdAndUpdate(req.params.groupId, req.body, {new: true})
        .then( group => res.json(group));
    })
    .catch(next);
});

// http DELETE :3000/api/group/5aa8b142eb28637009a35fe3 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6Ijk3OTZmOGMzNjI2NDhhMDM0YzNkMzg1YmU4MjIyNTFkZTUyYTBmNTY4NWI5ZDM4ODg3NTNkMjUwZjljMjFhODkiLCJpYXQiOjE1MjEwMDQ3OTB9.I_xZOfe87-EQWz_vnHzHCSO26bWtarNeheEM18I_wEA'
groupRouter.delete('/api/group/:groupId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/group/:groupId');

  return Group.findById(req.params.groupId)
    .then( group => {
      if(group.owner.toString() !== req.user._id.toString()) return next(createError(403, 'forbidden access'));
      let profileUpdates = [];
      group.users.forEach(function(luser) {
        profileUpdates.push(
          Profile.findOne({ userID: luser })
            .then( user => {
              user.groups.pull(req.params.groupId);
              return user.save();
            }));
      });
      return Promise.all(profileUpdates)
        .then( () => group.remove())
        .catch(next);
    })
    .then(() => res.status(204).send())
    .catch(next);
});

// RETURNS 1 SPECIFIC GROUP
groupRouter.get('/api/group/:groupId', bearerAuth, function(req, res, next) {
  debug('GET: /api/group/:groupId');

  Group.findById(req.params.groupId)
    .then(group => res.json(group))
    .catch(next);
});

// returns all groups
groupRouter.get('/api/groups', bearerAuth, function(req, res, next) {
  debug('GET: /api/groups');

  Group.find()
    .then(groups => res.json(groups))
    .catch(next);
});

groupRouter.get('/api/groupNames/:groupName', function (req, res, next) {
  debug('GET: /api/groupNames/:groupName');

  Group.findOne({ groupName: req.params.groupName })
    .then( group => {
      if(!group) {
        return res.sendStatus(200);
      }
      return res.sendStatus(409);
    })
    .catch(next);
});

// returns all public groups
groupRouter.get('/api/groups/all/public', bearerAuth, jsonParser, function(req, res, next) {
  debug('GET: /api/groups/allpublic');
  console.log('all public groups server route hit');
  Group.find({ privacy: 'public' })
    .then(groups => {
      console.log('groups: ', groups);
      res.json(groups);
    })
    .catch(next);
});

// returns all leagues of logged in user
groupRouter.post('/api/groups/user', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/groups/user');
  console.log('req.body: ', req.body);

  Group.find( { _id: { $in: req.body} } )
    .then(groups => res.json(groups))
    .catch(next);
});