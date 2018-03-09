# Code Fellows: Code 401d22: Full-Stack JavaScript

## Lab 07: HTTP Server
A basic HTTP server with GET and POST routes. Users can request cowified strings with the POST route, and can use query strings to access cowified ascii images in the browser.

## Tech/frameworks/packages

- node 
- npm
- node packages
  - jest
  - eslint
  - dotenv
  - winston
  - http
  - cowsay
  - url

## Code Example
`echo '{"text": "Get Cool Cow Text"}' | http post localhost:3000/api/cowsay`
## Installation

1. Fork and clone https://github.com/kennieU/README.md to your computer.
1. `cd` into `lab-ken/` and run `npm install`.
1. `touch .env` and add `PORT=3000`.

## Tests

run `npm test` to check tests.

1. POST should respond with a 200 status code and an object with a "content" property containing a cow string.
1. POST should respond with a 400 status code and an object containing an error property if an object is sent without a text property.
1. POST should respond with a 400 status code and an object containing an error property if no data is sent.
1. POST should respond with a 404 status code and an object containing an error property if a bad route is sent.

## How to use?

After installation, from `lab-ken/` run `npm start` to start the server. 

From a different terminal window, make POST requests using httpie (install with homebrew if you need it).

`echo '{"text": "Get Cool Cow Text"}' | http post localhost:3000/api/cowsay` 

To use POST, you must send an object with a "text" key and string value.

To access the GET route, go to `localhost:3000/` in a browser.

From there, click on `cowsay` to get some cows. To get special cows in the browser, use a query string with `text`.

Example url: `http://localhost:3000/cowsay?text=Noob%20Nub%20Doobey%20Dub`

## Contribute

You can totally contribute to this project if you want. Fork the repo, make some cool changes and then submit a PR.

## Credits



## License

MIT.