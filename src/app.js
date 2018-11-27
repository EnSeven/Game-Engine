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


//  --- ROUTES ------------------------------------

// Renders landing page
app.get('/', (request, response) => {
  response.render('site');
});

// app.post('/signup', (request, response => {
//    Takes POST data and sends to API server
// });
// app.post('/login', auth, (request, response) => {
  //    Takes POST data and sends to API server
// });

// serves Socket.IO linked html page, see index.html for examples of Socket-IO client useage.
app.get('/join', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

//  --- SOCKET IO ---------------------------------

// Socket.IO requires a connection to a http server instance, so one is created here.  It cannot attach directy to `app`.
const server = require('http').Server(app);
const io = require('socket.io')(server);

// This uses built-in event emitters for when a user connects or disconnects to a Socket.IO linked resource.
// Currently this triggers when clients got to the /join route or when they navigate away from the /join route.
// Simply console logging on connect or disconnect for now, but can be expanded to do other things.
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// This watches for chat messages from the index.html page and console logs them as they come.
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
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
  server.listen(port, () => {
    console.log('Game Server Listening on port ', port);
  });
};

module.exports = start;