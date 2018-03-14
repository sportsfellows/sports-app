# Code Fellows: Code 401d22: Full-Stack JavaScript

## Project: CF Madness (sports bracket app)




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

#### `Auth route to signup a user and signin /api/signup /api/signin`

Create a new  user with the properties `username`, `email`, `password` and `findHash` (findHash is automatically created for you).

```

http POST :3000/api/signup username=newusername email=newemail@gmail.com password=newpassword
http POST :3000/api/signup username=<username> email=<email> password=<password>
```

As an existing user you can login to your profile, which will authenticate you with a json web token and allow you to make requests to our API.

```
http -a newusername:newpassword :3000/api/signin
http -a <username>:<password> :3000/api/signin

```

Throws an error if any of the requested properties that are not created for you are missing.

The User model will return a json web token if there are no errors and create a profile model for the newly instantiated user to add more detailed information to.

#### `Profile Route: /api/profile/:profileId && /api/profile/:profileId`

Retrieve your user profile and update your information for other users to see.

```
http -a <username>:<password> :3000/api/signin
http -a <username>:<password> :3000/api/list/<list id>
http -a <username>:<password> :3000/api/lists
```

Throws an error if the route can't be found, the list id is invalid or the use is not authenticated.

#### `DELETE /api/list/<list id>`

Deletes a specific list as requested by the <list id>.

```
http -a <username>:<password> DELETE :3000/api/list/<list id>
```

If successful, a 204 status is returned.

Throws an error if the request parameter (id) is missing or the user is not authenticated.


#### `PUT /api/list/<list id>`

Updates a Jlist with the properties `name`, `desc`, `created` and `userID` from your MongoDB as requested by the <list id>.

```
http -a <username>:<password> PUT :3000/api/list/<list id> name='new list name'
```

If successful, the list is returned with a 200 status.

If a request is made with a list id that is not found, a 404 status is returned.

If a request is made with no list id a 400 status is returned.

If a request is made with out an authenticated user a 401 status is returned.

## Tests

run `npm run tests` to check tests.

#### POST

1. The User model should create and return s json web token and a 200 status code if there is no error.
2. The List model should create and return a new list.
3. Both should respond with a 400 status code if there is no request body.
4. The List model should respond with a 401 status code if there is no json web token provided.

#### GET

1. The User model should return a user's json web token and a 200 status code if there is no error.
2. The list model should return a user's list and a 200 status code if there is no error.
3. The List model should respond with a 401 status code if there is no json web token provided
4. should respond with a 404 status code if a request is made with an id that is not found.
5. The List model should respond with a 200 status code and all lists if there is no parameter (id).

#### DELETE

1. The List model should return a 204 status code if there are no errors.
2. The List model should respond with a 400 status code if there is no parameter (id).
3. The List model should respond with a 404 status code if a request is made with an id that is not found.
4. The List model should respond with a 401 status code if there is no json web token provided.

#### PUT

1. The List model should update and return the updated list along with a 200 status code if there are no errors.
2. The List model should respond with a 400 status code if there is an invalid request body.
3. The List model should respond with a 404 status code if a request is made with an id that is not found.
4. The List model should respond with a 401 status code if there is no json web token provided.

## Contribute

You can totally contribute to this project if you want. Fork the repo, make some cool changes and then submit a PR.

## Credits

Initial codebase created by Code Fellows.

## License

MIT. Use it up!