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
// ioserver.listen(8080);

//  --- SOCKET IO ---------------------------------

// This function holds all emitters and listeners for Socket.IO
io.sockets.on('connection', (socket) => {
  socketConnections.push(socket.id);
  console.log(socketConnections);
  socket.on('start', () => {
    socket.emit('connected');
  });
  
  // when someone disconnects
  socket.on('disconnect', () => {
    socket.removeAllListeners();
    console.log(`${socket.username} has left the game`);
  });
  
  // handles logins for new and returning clients.  Expected input: (Object) {username: 'username', password: 'password', email: 'email'}
  // socket.on('sign-in', (userObj) => {
  // superagent.get(`${process.env.API_URL}/playerstats/${userObj.username}`)
  //   .then(results => {
  //     if (results.length === 0) {
  socket.on('sign-in', (userObj) => {
    superagent.post(`${process.env.API_URL}/signup`)
      .send(JSON.stringify(userObj))
      .set('Content-Type', 'application/json')
      .then(data => {
        userObj.auth = data.text;
        socket.emit('signed-in-newuser', userObj.username);
        console.log(`${userObj.username} has signed up and signed in`);
      })
      .catch(error => {
        if (error) {
          console.log('Error signing in', error);
        }
      });
  });
  // });
  //       else {
  //         socket.emit('signing-in');
  //         superagent.post(`${process.env.API_URL}/signin`)
  //           .send(`{'username' : ${socket.username.toString()}, 'password' : ${socket.password.toString()}`)
  //           .set('Content-Type', 'application/json')
  //           .then(data => {
  //             socket.auth = data.req.headers.auth;
  //             socket.emit('signed-in', socket.username);
  //             console.log(`Returning user ${socket.username} has signed in`);
  //           })
  //           .catch(error => {
  //             if (error) {
  //               console.log('Error signing in');
  //             }
  //           });
  //       }
  //     })
  //     .catch(err => console.log(err));
  // });

      

  
  // After a client signs in, joins a new game.  Waits for two clients before starting the game
  // Expected input: (String) 'username'
  socket.on('join', (username) => {
    console.log(username, ' joined');
    Game.joinGame(username);
    socket.emit('player1-joined', username);
  });
  
  //  Runs game related functions from game-engine.js
  // wait for both players before starting
  let playCount = 0;
  players.on('play', () => {
    playCount++;
    while (playCount < 2) {
      setTimeout(() => {
        console.log('Player one ready to start, waiting for player two');
      },5000);
    }
    console.log('players joined, game starting');
    //  Input is an array of two player objects
    let bothPlayerObjs = [Game.player1, Game.player2];
    Game.playerTracker = 1;
    //  This loop runs until the game is completed or the players quit
    while(Game.gameover !== true) {
      Game.getClientInput();
      Game.applyInput(Game.currentInput);
    }
    //  Function for dealing with a completed game
    Game.determineWinner(bothPlayerObjs);
    //  Closing out the game session
    Game.endSession();  //  If spectating makes it in, this should pass in spectators array as a second parameter as well.
  });
  
  socket.on('get-stats', (socket) => {
    superagent.get(`${process.env.API_URL}/playerstats/${socket}`)
      .then(results => {
        let stats = {
          username: results.name,
          wins: results.wins,
          losses: results.losses,
        };
        players.in(`player${socket}`).emit('stats', stats)
          .catch(err => console.log(err));
      });
  });

  // Listens for quit event from either client during play.  Will confirm the quit with both players
  players.on('quit-game', () => {
    Game.quit();
    players.emit('end');
  });
// spectators.broadcast.emit('watch-broadcast', (socket) => {  
// Not focusing on this now, still need to figure out what to pass through
//   socket.players = [Game.player1.username, Game.player2.username];
//   socket.spectators = [Game.spectators];
// });
// spectators.on('leave-game', (socket) => {
//   // TODO
// });
// });
});

//  --- EXPORTS -----------------------------------

const start = (port) => {
  ioserver.listen(port, () => {
    console.log('Game Server Listening');
  });
};

module.exports = start;