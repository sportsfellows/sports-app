'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('sportsapp:auth-router');
const createError = require('http-errors');
const Router = require('express').Router;
const basicAuth = require('../../lib/basic-auth-middleware.js');
const User = require('../../model/user/user.js');

const authRouter = module.exports = Router();

// http POST :3000/api/signup username=aaaaaaa email=brewgewgewbianbixby0@gmail.com password=password1
authRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST: /api/signup');
  if (!req.body.username || !req.body.email || !req.body.password) return next(createError(400, 'expected a request body username, email and password'));

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);
  user.generatePasswordHash(password)
    .then( user => user.save())
    .then( () => user.generateToken())
    .then( token => res.send(token))
    .catch(next);
});

// http -a aaaaaaa:password1 :3000/api/signin
authRouter.get('/api/signin', basicAuth, function(req, res, next) {
  debug('GET: /api/signin');
 
  User.findOne({ username: req.auth.username})
    .then(myUser => {
      if(!myUser) throw createError(401);
      return myUser;
    })
    .then( myUser => myUser.comparePasswordHash(req.auth.password))
    .then( myUser => myUser.generateToken())
    .then( token => res.send(token))
    .catch(next);
});

authRouter.get('/api/signup/usernames/:username', function (req, res, next) {
  debug('GET: /api/signup/usernames/:username');

  User.findOne({ username: req.params.username })
    .then( user => {
      if(!user) {
        return res.sendStatus(200);
      }
      return res.sendStatus(409);
    })
    .catch(next);
});

// .get('/oauth/google', (req, res, next) => {
//   if(!req.query.code) {
//     res.redirect(process.env.CLIENT_URL)
//   } else {
//     console.log('code: ', req.query.code)
//     superagent.post('https://www.googleapis.com/oauth2/v4/token')
//     .type('form')
//     .send({
//       code: req.query.code,
//       grant_type: 'authorization_code',
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       redirect_uri: `${process.env.API_URL}/oauth/google`,
//     })
//     .then(response => {
//       console.log('::::::initial req:::::::', response.body);
//       return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
//       .set('Authorization', `Bearer ${response.body.access_token}`)
//     })
//     .then(response => {
//       console.log(':::::OPEN ID:::::::- GOOGLE PLUS', response.body);
//       // handle oauth login
//       res.cookie('X-Some-Cookie', 'some-token');
//       // console.log(X-Some-Cookie);
//       res.redirect(process.env.CLIENT_URL);
//     })
//   }
// })