'use strict';

//  --- DEPENDANCIES ------------------------------

require('dotenv').config();

//  --- EXPRESS SETUP -----------------------------

const express = require('express');
const app = express();
// Setting the view engine to ejs and enabling JSON for POST requests
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
// const server = require('http').createServer(app);
// const io = require('socket.io')(server, {
//   path: '/join',
//   serveClient: true,
//   // below are engine.IO options
//   pingInterval: 10000,
//   pingTimeout: 5000,
// });
const http = require('http').Server(app);
var io = require(`https://enseven-game-engine.herokuapp.com:3030/socket.io/sockect.io.js`)(http);

http.listen(3030, function(){
  console.log('Socket.IO listening on *:3030');
});
let sockets = [];


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
app.post(`${process.env.API_URL}/api/v1/singlestat`, (request, response) => {
  request.body = {'name':'from-engine','win':true};
  // console.log(response.body);
  request.send(request.body);
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
  console.log('sockets', sockets);

  // when someone connects via node client.js
  socket.on('start', () => {
    socket.emit('connected', `Player ${socket.id} ready`);
    console.log(`Player ${socket.id} has joined the game`);

  });

  // when someone disconnects via node client.js
  socket.on('disconnect', () => {
    socket.removeAllListeners();
    console.log(`Player ${socket.id} has left the game`);
  });

});

let player1 = null;
let player2 = null;
io.on('connection', function(socket){
  socket.on('join', function(user){
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

module.exports = start;