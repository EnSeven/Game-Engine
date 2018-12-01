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
const io = require('socket.io')(ioserver);
let socketUsers = [];
let socketConnections = [];
ioserver.listen(process.env.PORT);
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


let player1 = undefined;
let player2 = undefined;
//  --- SOCKET IO ---------------------------------

// This holds all emitters and listeners for Socket.IO
io.sockets.on('connection', (socket) => {
  socketConnections.push(socket);
  
  // when someone connects via client.js
  socket.on('start', () => {
    socket.emit('connected', `Player ID ${socket.id} connected`);
  });
  
  // when someone disconnects via client.js
  socket.on('disconnect', () => {
    socket.removeAllListeners();
    console.log(`Player ID ${socket.id} has left the game`);
  });

  // after the connection is confirmed.  Takes a socket and assigns to players 1 and 2, then emits 'ready'
  socket.on('join', function(socket){
    console.log(`Welcome, ${JSON.parse(socket.req.data).username}!
    auth: ${socket.text}`);
    if(player1 == undefined) {
      player1 = JSON.parse(socket.req.data).username;
      console.log(player1);
    }
    else if (player2 == undefined) {
      player2 = JSON.parse(socket.req.data).username;
      console.log(player1, player2);
    } 
    if(player1 && player2) {
      io.emit('ready');
    }
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

module.exports = start;