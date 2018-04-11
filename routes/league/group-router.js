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
  // Review: looooooooooong line
  if (!req.body.groupName || !req.body.privacy) return next(createError(400, 'expected a request body groupName, privacy'));
  req.body.owner = req.user._id;
  req.body.users = req.user._id;
 
  let group = new Group(req.body).save()
    .then( myGroup => {
      group = myGroup;
      return new MessageBoard({ groupID: group._id }).save();
    })
    .then( () => {
      return Profile.findOne({ userID: req.user._id })
        // Review: What's up with all of these catches before the thens?
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

  // Review: Why do you return this call but you don't return the initial call in the other routes?
  return Group.findById(req.params.groupId)
    .then( group => {
      group.users.push(req.user._id);
      return group.save();
    })
    .then( group => {
      return Profile.findOne({ userID: req.user._id })
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( profile => {
          profile.groups.push(req.params.groupId);
          profile.save();
          let returnObj = { groupUsers: group.users, profileGroups: profile.groups };
          res.json(returnObj);
        });
    })
    .catch(next);
});

// http PUT :3000/api/group/5aa8b142eb28637009a35fe3/removeuser 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjZiZjIwNzZkOWI0MThlMTcwN2VjNzU1NWY3MWM2YTRhYTQxYThlYjJhZmZmZjg3YzEzNzlmMjhiMjgxZDUzNTQiLCJpYXQiOjE1MjEwMDUwNjF9.QFL8nK6rS-_sDfD9XdZFhXcnXR75zMdKNKTjQl_8T_4'
groupRouter.put('/api/group/:groupId/removeuser', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/group/:groupId/removeuser');

  return Group.findById(req.params.groupId)
    .then( group => {
      // Review: SUPER Cool that you found this 'pull' method. Nice work!
      group.users.pull(req.user._id);
      return group.save();
    })
    .then( group => {
      return Profile.findOne({ userID: req.user._id })
        .catch( err => Promise.reject(createError(404, err.message)))
        .then( profile => {
          profile.groups.pull(req.params.groupId);
          // Review: Careful, this is an async call. What happens if there's an error with the save()?
          // Review: Where does the error go? Consider this scenario:
          //
          //  Promise.resolve('data')
          //   	.then(data => {
          //   		console.log('in first then')
          //   		Promise.reject('broken stuff') // this is like your .save()
          //
          //   		return data;
          //   	})
          //   	.then(data => {
          //   		console.log('in second then')
          //   	})
          //   	.catch(stuff => console.log(stuff, 'in second catch')) // no errors here
          //    
          //  <Results:></Results:>
          //   in first then
          //   in second then
          //   Uncaught (in promise) broken stuff

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
  // Review: Super duper long, this definitely should be broken up. Typically, it is convention
  // Review: that your lines are not greater than ~100 characters
  // Review: That being said, this is a great use of ||, nice job!
  let groupProperties = req.body.groupName || req.body.privacy || req.body.size || req.body.motto || req.body.createdOn || req.body.image || req.body.owner || req.body.password || req.body.users || req.body.tags;

  // Review: Could be something like this?
  // let groupProperties = req.body.groupName 
  //   || req.body.privacy 
  //   || req.body.size 
  //   || req.body.motto 
  //   || req.body.createdOn 
  //   || req.body.image 
  //   || req.body.owner 
  //   || req.body.password 
  //   || req.body.users 
  //   || req.body.tags;

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
      // Review: If for some reason the group doesn't exist this line would throw an error
      if(group.owner.toString() !== req.user._id.toString()) return next(createError(403, 'forbidden access'));
      let profileUpdates = [];
      // Review: luser?
      // Review: Maybe this would be a good spot for a map instead of a forEach/push
      group.users.forEach(function(luser) {
        profileUpdates.push(
          Profile.findOne({ userID: luser })
            .then( user => {
              user.groups.pull(req.params.groupId);
              return user.save();
            }));
      });
      // Review: Often it is convention to put a single blank line above a return to visually separate it
      return Promise.all(profileUpdates)
        .then( () => group.remove())
        .catch(next);
    })
    .then(() => res.status(204).send())
    .catch(next);
});

groupRouter.get('/api/group/:groupId', bearerAuth, function(req, res, next) {
  debug('GET: /api/group/:groupId');

  Group.findById(req.params.groupId)
    .then(group => res.json(group))
    .catch(next);
});

groupRouter.get('/api/groups', bearerAuth, function(req, res, next) {
  debug('GET: /api/groups');

  Group.find()
    .then(groups => res.json(groups))
    .catch(next);
});
