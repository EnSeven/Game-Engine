'use strict';

require('dotenv').config();

//  Pulling in start function from ./src/app.js
const start = require('./src/app.js');

//  PORT defined in .env file
start(process.env.PORT || 3000);