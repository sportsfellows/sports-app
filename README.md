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
text and stuff go here

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

This will return an array of objects.
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
text and stuff go here
```
and stuff goes here
```
#### GET: `/api/team/<team id>`
text and stuff go here
```
and stuff goes here
```
#### PUT: `/api/team/<team id>`
text and stuff go here
```
and stuff goes here
```

### Group Routes
#### POST: `/api/group`
text and stuff go here
```
and stuff goes here
```
#### GET: `/api/groups`
text and stuff go here
```
and stuff goes here
```
#### GET: `/api/group/:groupId`
text and stuff go here
```
and stuff goes here
```
#### PUT: `/api/group/:groupId`
text and stuff go here
```
and stuff goes here
```
#### PUT: `/api/group/:groupId/adduser`
text and stuff go here
```
and stuff goes here
```
#### PUT: `/api/group/:groupId/removeuser`
text and stuff go here
```
and stuff goes here
```
#### DELETE: `/api/group/:groupId`
text and stuff go here
```
and stuff goes here
```

### League Routes
#### POST: `/api/sportingevent/:sportingeventId/league`
text and stuff go here
```
and stuff goes here
```
#### GET: `/api/leagues`
text and stuff go here
```
and stuff goes here
```
#### GET: `/api/league/:leagueId`
text and stuff go here
```
and stuff goes here
```
#### PUT: `/api/league/:leagueId`
text and stuff go here
```
and stuff goes here
```
#### PUT: `/api/league/:leagueId/adduser`
text and stuff go here
```
and stuff goes here
```
#### PUT: `/api/league/:leagueId/removeuser`
text and stuff go here
```
and stuff goes here
```
#### DELETE: `/api/league/:leagueId`
text and stuff go here
```
and stuff goes here
```

### User Pick Routes
#### POST: `/api/league/<league id>/userpick`
text and stuff go here
```
and stuff goes here
```
#### GET: `/api/userpicks`
text and stuff go here
```
and stuff goes here
```
#### GET: `/api/userpick/<user pick id>`
text and stuff go here
```
and stuff goes here
```
#### PUT: `/api/userpick/<user pick id>`
text and stuff go here
```
and stuff goes here
```

### Score Board Routes
#### GET: `/api/scoreboards`
text and stuff go here
```
and stuff goes here
```
#### GET: `/api/scoreboard/:scoreBoardId`
text and stuff go here
```
and stuff goes here
```

### Message Board Routes
#### GET: `/api/messageboards`
text and stuff go here
```
and stuff goes here
```
#### GET: `/api/messageboard/:messageBoardId`
text and stuff go here
```
and stuff goes here
```

### Comment Routes
#### POST: `/api/messageboard/:messageBoardId/comment`
text and stuff go here
```
and stuff goes here
```
#### GET: `/api/comments`
text and stuff go here
```
and stuff goes here
```
#### GET: `/api/comment/:commentId`
text and stuff go here
```
and stuff goes here
```

## Tests

Tests are ran by using the jest testing suite. To run tests, first you must download and copy this repo and run `npm i` in the root directory to install all application dependancies. Run `npm run tests` in the root directory of the application in your terminal to check tests.

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
