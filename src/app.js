'use strict';

//  --- DEPENDANCIES ------------------------------

require('dotenv').config();
const Game = require('./lib/game-engine.js');
const superagent = require('superagent');
const ioserver = require('http').createServer(8080);
const io = require('socket.io')(ioserver);
const players = io.of('/players');
const spectators = io.of('spectators');
let socketConnections = [];

//  --- SOCKET IO ---------------------------------

// This function holds all emitters and listeners for Socket.IO
io.sockets.on('connection', (socket) => {
  
  socketConnections.push(socket);
  
  // when someone connects
  socket.on('start', () => {
    socket.emit('connected', `Player ID ${socket.id} connected`);
  });
  
  // when someone disconnects6s6s
  socket.on('disconnect', () => {
    socket.removeAllListeners();
    console.log(`${socket.username} has left the game`);
  });
  
  // handles logins for new and returning clients.  Expected input: (Object) {username: 'username', password: 'password', email: 'email'}
  socket.on('signin', (socket) => {
    let user = `'username' : ${socket.username.toString()}, 'password' : ${socket.password.toString()}, 'email' : ${socket.email.toString()}}`;
    superagent.get(`${process.env.API_URL}/api/v1/users/${user.username}`)
      .then(results => {
        if (results.length[0]) {
          socket.emit('signingup');
          superagent.post(`${process.env.API_URL}/signup`)
            .send(user)
            .set('Content-Type', 'application/json')
            .then(data => {
              user.auth = data.req.headers.auth;
              socket.emit('signedin-new', user.username);
              console.log(`${socket.username} has signed up and signed in`);
            })
            .catch(error => {
              if (error) {
                console.log('Error signing in');
              }
            });
        }
        else {
          superagent.post(`${process.env.API_URL}/signin`)
            // .send(`{'username' : ${socket.username.toString()}, 'password' : ${socket.password.toString()}`)
            .set('Content-Type', 'application/json')
            .then(data => {
              socket.auth = data.req.headers.auth;
              socket.emit('signedin-returning', socket.username);
              console.log(`${socket.username} has returned and signed in`);
            })
            .catch(error => {
              if (error) {
                console.log('Error signing in');
              }
            });
        }
      })
      .catch(err => console.log(err));
  });
  
  // After a client signs in, joins a new game.  Waits for two clients before starting the game
  // Expected input: (String) 'username'
  socket.on('join', (socket) => {
    Game.joinGame(socket);
  });
  
  //  Runs game related functions from game-engine.js
  // wait for both players before starting
  let playCount = 0;
  players.on('play', () => {
    playCount++;
    while (playCount < 2) {
      setTimeout(() => {
        console.log('Player one ready to start, waiting for player two');
      },3000);
    }
    console.log('players joined, game starting');
    //  Input is an array of two player objects
    let bothPlayerObjs = [Game.player1, Game.player2];

    //  Functions for running the game go here
    //  Only one for now.  Can be many functions between events to/from the client instead of one huge function
    Game.gameStuffHappens(bothPlayerObjs);
    
    //  Function for dealing with a completed game
    Game.determineWinner(bothPlayerObjs);
    //  Closing out the game session
    Game.endSession();  //  If spectating makes it in, this should pass in spectators array as a second parameter as well.
    
  });
  
  // Listens for quit event from either client during play.  Will confirm the quit with both players
  players.on('quit', () => {
    Game.quit();
  });

  spectators.broadcast.emit('watch-broadcast', (socket) => {  // Not focusing on this now, need to figure out what to pass through
    socket.players = [Game.player1.username, Game.player2.username];
    socket.spectators = [Game.spectators];
  });
});


//  --- EXPORTS -----------------------------------

const start = (port) => {
  ioserver.listen(port, () => {
    console.log('Game Server Listening');
  });
};

module.exports = start;