# Code Fellows: Code 401d22: Full-Stack JavaScript

## Project: CF Madness (sports bracket app)

CF Madness is an application allows users to compete against their friends by choosing winners for real world sports games. 

You are able to create and manage your own leagues and will have a personal scoreboard for each participant. Each league will also have its own message board that will allow you to communicate with those in your league. Each league also has the option to be private or public.

If you are not participating in a league or would like to communicate with those outside of your league, you can also create a group. Like a league, each group has its own message board so users can communicate with each other.

## Tech/frameworks/packages

- node 
- MongoDB
- travis
- heroku
- github
- npm
- node packages
  - Production
    - aws-sdk
    - bcrypt
    - bluebird
    - body-parser 
    - cors
    - coveralls
    - crypto 
    - debug 
    - del 
    - dotenv 
    - express 
    - faker 
    - http-errors 
    - istanbul 
    - jsonwebtoken 
    - mongoose 
    - morgan
    - multer 
  - Dev
    - eslint
    - jest
    - superagent

## Entity Relationship Diagram

![Demo](./public/img/erd.png)
https://www.lucidchart.com/documents/view/ccfd14a4-7127-4097-8bf9-ca0d567cc323/0
MONGODB_URI='mongodb://heroku_5s3dhwdr:vm0d8l4q47rb9psbn1o247o2in@ds263138.mlab.com:63138/heroku_5s3dhwdr'


## How to use?
Clone this repo, cd into the root of the project, run `npm i` from your command line to install all of our dependencies. Please make sure that you have mongodb and httpie installed on your machine, you can brew install them both if you do not already have them `brew install httpie mongodb`. Please refernce the installation instructions for MongoDB `https://docs.mongodb.com/manual/administration/install-community/`, there is typically 1 or 2 quick things you need to do after you Brew install it. 

Run `npm run start` from terminal to start the server. Open a new tab in terminal and run `mongod` to start the Mongo process. Open another terminal tab and run `mongo` to open a Mongo shell (for viewing the contents of your local database). Lastly, open up a final terminal tab; this is where you will be making all of your server requests, instructions and examples are below.

## Routes

### Auth/User Routes
#### POST: `/api/signup`
Create a new  user with the properties `username`, `email`, `password` and `findHash` (findHash is automatically created for you).
```
http POST :3000/api/signup username=newusername email=newemail@gmail.com password=newpassword
http POST :3000/api/signup username=<username> email=<email> password=<password>
```
#### GET: `/api/signin`
As an existing user you can login to your profile, which will authenticate you with a json web token and allow you to make requests to our API.
```
http POST :3000/api/signup username=newusername email=newemail@gmail.com password=newpassword
http POST :3000/api/signup username=<username> email=<email> password=<password>
```
Throws an error if any of the requested properties that are not created for you are missing.

The User model will return a json web token if there are no errors and create a profile model for the newly instantiated user to add more detailed information to.

### Profile Routes
#### GET: `/api/profile/<profile id>`
Retrieve your user profile and update your information for other users to see.

```
http -a newusername:newpassword :3000/api/signin
http -a <username>:<password> :3000/api/signin
```
Throws an error if any of the requested properties that are not created for you are missing.

The User model will return a json web token if there are no errors.
#### PUT: `/api/profile/<profile id>`
This will allow you to make changes to a specific profile.

### Sporting Event Routes
#### POST: `/api/sportingevent`

Add a sporting event with the properties `name`, `desc`, `createdOn`, and `tags`. The property `createdOn` is generated automatically and the `tags` property is available for any extra information that a user may want to add.

```
http POST :3000/api/sportingevent 'Authorization:Bearer <token>' sportingEventName='<event name>' desc='<description>'
```
After a successful POST, you receive an object of the new sporting event you created, like the example below:
```
{
    "__v": 0, 
    "_id": "5aa9acbe42358a6e7b6a6450", 
    "createdOn": "2018-03-14T23:14:06.602Z", 
    "desc": "some text and stuff", 
    "sportingEventName": "baseball", 
    "tags": []
}
```

#### GET: `/api/sportingevent/<sporting event id>`

```
http GET :3000/api/sportingevent/<sporting event id> 'Authorization:Bearer <token>'
```

This will return an object of your sporting event, like the example below:
```
{
    "__v": 0, 
    "_id": "5aa9acbe42358a6e7b6a6450", 
    "createdOn": "2018-03-14T23:14:06.602Z", 
    "desc": "some text and stuff", 
    "sportingEventName": "baseball", 
    "tags": []
}
```
### Game Routes
#### GET: `/api/games`
This will allow you to get all games.
```
http :3000/api/games 'Authorization:Bearer <token>'
```

This will return an array of games.
#### GET: `/api/game/<game id>`
This will return a specific game.
```
http :3000/api/game/<game id> 'Authorization: Bearer <token>'
```
You will receive an object for that specific game.
#### PUT: `/api/game/<game id>`
This will allow you to make changes to a specific game.
```
http PUT :3000/api/game/<game id> 'Authorization:Bearer <token>' homeTeam='hometeam' awayTeam='awayteam' dateTime='datetime' weight='weight' homeScore='homescore' awayScore='awayscore' status='status' winner='winner' loser='loser' sportingEventID='sportingeventid' tags='tags'
```

You will receive the updated object of the game you just modified.

### Team Routes
#### POST: `/api/sportingevent/<sporting event id>/team`
You can create a new team with properties `teamName`, `sportingEventID`, `createdOn` which can also be automatically generated, `seed`, `wins`, `losses`, `pretournamentRecord`, and `tags`. Values that are required are `teamName` and `sportingEventId`.
```
http POST :3000/api/sportingevent/<sportingeventid>/team 'Authorization:Bearer <token>' teamName='team name'
```
#### GET: `/api/teams`
Use this call to get an array of all team objects.
```
http :3000/api/teams 'Authorization:Bearer <token>'
```
#### GET: `/api/team/<team id>`
Use this call to get a specific team object.
```
http :3000/api/team/<team id> 'Authorization:Bearer <token>'
```
#### PUT: `/api/team/<team id>`
Use this call to make edits to a specific team.
```
http PUT :3000/api/team/<team id> 'Authorization:Bearer <token>' property='property value'
```
You will receive an object of the team you updated.

### Group Routes
#### POST: `/api/group`
You can create a new group (ie. family, friends, work friends), in which to compete by choosing teams of sporting games. The properties `groupName`, `privacy`, `size`, `motto`, `createdOn`, `image`, `owner`, `password`, `users`, and `tags`. Values that are required are `groupName`, and `privacy`. 
```
and stuff goes here
```
#### GET: `/api/groups`
Use this call to get an array of all group objects.
```
and stuff goes here
```
#### GET: `/api/group/:groupId`
Use this call to get a specific group object.
```
and stuff goes here
```
#### PUT: `/api/group/:groupId`
Use this call to make edits to a specific group.
```
and stuff goes here
```
#### PUT: `/api/group/:groupId/adduser`
Use this call to make edits adding a group user to a specific group.
```
and stuff goes here
```
#### PUT: `/api/group/:groupId/removeuser`
Use this call to make edits to remove a group user from a specific group.
```
and stuff goes here
```
#### DELETE: `/api/group/:groupId`
Use this call to delete a specific group.
```
and stuff goes here
```

### League Routes
#### POST: `/api/sportingevent/:sportingeventId/league`
You can create a new league with properties `leagueName`, `sportingEventID`, `owner`, `scoring`, `poolSize`, `privacy`, `password`, `winner`, `status`, `users`, `createdOn` which can also be automatically generated, `size`, `paidUsers`, and `tags`. Values that are required are `leagueName`, `sportingEventId`, `owner`, `scoring`, `poolSize`, and `privacy`.
```
and stuff goes here
```
#### GET: `/api/leagues`
Use this call to get an array of all league objects.
```
and stuff goes here
```
#### GET: `/api/league/:leagueId`
Use this call to get a specific league object.
```
and stuff goes here
```
#### PUT: `/api/league/:leagueId`
Use this call to make edits to a specific league.
```
and stuff goes here
```
#### PUT: `/api/league/:leagueId/adduser`
Use this call to make edits adding a league user to a specific league.
```
and stuff goes here
```
#### PUT: `/api/league/:leagueId/removeuser`
Use this call to make edits removing a league user from a specific league.
```
and stuff goes here
```
#### DELETE: `/api/league/:leagueId`
Use this call to delete a specific group.
```
and stuff goes here
```

### User Pick Routes
#### POST: `/api/league/<league id>/userpick`
A user can create their pick with properties `userID` which is automatically filled in with the user who created the pick, `leagueID`, `gameID`, `pick` which is the id of the team, `correct` which is a boolean value, and `gameTime`. All properties are required except `correct` which will be changed at the end of the game.
```
http POST :3000/api/league/<league id>/userpick 'Authorization:Bearer <token>' gameID='gameID' pick='teamID' gameTime='Date'
```
This will return with an object of the created pick.
#### GET: `/api/userpicks`
With this, you will get an array of all user pick objects.
```
http :3000/api/userpicks 'Authorization:Bearer <token>'
```
#### GET: `/api/userpick/<user pick id>`
This will give you a specific user pick object.
```
http :3000/api/userpick/<user pick id> 'Authorization:Bearer <token>'
```
#### PUT: `/api/userpick/<user pick id>`
With this command, you can update a specific user pick.
```
http PUT :3000/api/userpick/<user pick id> 'Authorization:Bearer <token>' property='updated value'
```
Upon success, you will receive an object containing the user pick object that was modified.

### Score Board Routes
#### GET: `/api/scoreboards`
A users score is updated on the scoreboard according to their picks and the winning teams. Values required are `userID`, and `leagueID`.
```
and stuff goes here
```
#### GET: `/api/scoreboard/:scoreBoardId`
Use this call to get a specific scoreBoard object.
```
and stuff goes here
```

### Message Board Routes
#### GET: `/api/messageboards`
A user is able to message other users in their group. Properties used are `leagueID`, `groupID`, `comments`, and `tags`.
```
and stuff goes here
```
#### GET: `/api/messageboard/:messageBoardId`
Use this call to get a specific messageBoard object.
```
and stuff goes here
```

### Comment Routes
#### POST: `/api/messageboard/:messageBoardId/comment`
A user is able to comment on messages in the group. The properties used for this are `userID`, `messageBoardID`, `content`, `createdOn` which can also be automatically generated, and `tags`. Required properties are `userID`, `messageBoardID`, and `content`.
```
and stuff goes here
```
#### GET: `/api/comments`
Use this call to get a comment object.
```
and stuff goes here
```
#### GET: `/api/comment/:commentId`
Use this call to get a specific comment object.
```
and stuff goes here
```

## Tests

Tests are ran by using the jest testing suite. To run tests, first you must download and copy this repo and run `npm i` in the root directory to install all application dependancies. Run `npm run test` in the root directory of the application in your terminal to check tests.

## Contribute

You can totally contribute to this project if you want. Fork the repo, make some cool changes and then submit a PR.

## Credits

Initial codebase created by Code Fellows.

Bessie Arino

Brian Bixby

Greg Nordeng

Ken Unterseher

## License

MIT. Use it up!