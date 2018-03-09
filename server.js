'use strict';

const express = require('express');
const debug = require('debug')('sports-app:server');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const userRouter = require('./XXXXXXXX'); // name??
const sportRouter = require('./XXXXXXX'); // name??
const errors = require('./lib/error-middleware.js'); // name??

dotenv.load();

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(userRouter); // correct name?
app.use(sportRouter); //correct name?
app.use(errors); // name??

const server = module.exports = app.listen(PORT, () => {
  debug(`server up: ${PORT}`);
});