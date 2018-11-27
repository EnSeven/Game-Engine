'use strict';

require('dotenv').config();
// Set up Express
const express = require('express');
const app = express();

app.get('/', (request, response) => {
  response.send('route works!');
});

// app.listen(process.env.PORT, () => {
//   console.log('Game-Engine Server up on port ', process.env.PORT);
// });
let server = false;

module.exports = {
  start: (port) => {
    if(!server) {
      server = app.listen(port, (err) => {
        if(err) { throw err; }
        console.log('Game Engine Server running on ', port);
      });
    }
    else {
      console.log('Server is already running');
    }
  },
};