'use strict';

//  --- DEPENDANCIES ------------------------------

require('dotenv').config();

//  --- EXPRESS SETUP -----------------------------

const express = require('express');
const app = express();
const superagent = require('superagent');
const http = require('http');
// Setting the view engine to ejs and enabling JSON for POST requests
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
const ioserver = require('http').createServer(8080);
// const io = require('socket.io')(server, {
//   path: '/join',
//   serveClient: true,
//   // below are engine.IO options
//   pingInterval: 10000,
//   pingTimeout: 5000,
// });

// const io = require('socket.io')(3030);

let sockets = [];

const io = require('socket.io')(ioserver);
ioserver.listen(8080);
//  --- ROUTES ------------------------------------

// Renders landing page
app.get('/', (request, response) => {
  response.render('site');
});

// serves Socket.IO linked html page, see index.html for examples of Socket-IO client useage.
app.get('/join', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

//  Post to API after the game
app.post('/postdata', (request, response) => {
  let user = {'name':'from-engine','win':true};
  superagent.post(`${process.env.API_URL}/api/v1/singlestat`)
    .send(user)
    .then(() => {
      response.send('made it');
    });
  // console.log(response.body);
});

//  --- SOCKET IO ---------------------------------

// Socket.IO requires a connection to a http server instance, so one is created here.  It cannot attach directy to `app`.
// const server = require('http').Server(app);
// This uses built-in event emitters for when a user connects or disconnects to a Socket.IO linked resource.
// Currently this triggers when clients got to the /join route or when they navigate away from the /join route.
// Simply console logging on connect or disconnect for now, but can be expanded to do other things.
// when someone connects to the server (nodemon or node server.js)
io.on('connection', (socket) => {
  sockets.push(socket);
  
  // when someone connects via node client.js
  socket.on('start', () => {
    socket.emit('connected', `Player ID ${socket.id} connected`);
  });
  
  // when someone disconnects via node client.js
  socket.on('disconnect', () => {
    socket.removeAllListeners();
    console.log(`Player ID ${socket.id} has left the game`);
  });
});

let player1 = null;
let player2 = null;
io.on('connection', function(socket){
  socket.on('join', function(user){
    console.log(`Welcome, ${JSON.parse(user.req.data).username}!
    auth: ${user.text}`);
    let players = 0;
    if(!player1 && !player2) {
      player1 = user;
      players++;
    }
    else if (player1 && !player2) {
      player2 = user;
      players++;
    }
    else if (player1 && player2 && players == 2) {
      io.emit('ready');
    }
  });
});


// When a user posts a message, this sends it back out for everyone to hear.
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

//  --- EXPORTS -----------------------------------

// Start function exported for index.js.  The port to use must be defined in index.js.
// Listens on `server` and not `app`, otherwise Socket.IO cannot connect.
const start = (port) => {
  app.listen(port, () => {
    console.log('Game Server Listening on port ', port);
  });
};

// server.listen(process.env.PORT, () => console.log(`Listening on ${ process.env.PORT }`));
module.exports = start;