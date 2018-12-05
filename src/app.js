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
let playCount = 0;

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
    
       
  // superagent.post(`${process.env.API_URL}/signup`)
  //   .send(JSON.stringify(userObj))
  //   .set('Content-Type', 'application/json')
  //   .then(data => {
  //     userObj.auth = data.text;
  //     socket.emit('signed-in-newuser', userObj.username);
  //     console.log(`${userObj.username} has signed up and signed in`);
  //   })
  //   .catch(error => {
  //     if (error) {
  //       console.log('Error signing in', error);
  //     }

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

      
  socket.on('sign-up', (userObj) => {
    superagent.post(`${process.env.API_URL}/signup`)
      .send(JSON.stringify(userObj))
      .set('Content-Type', 'application/json')
      .then(data => {
        userObj.auth = data.text;
        socket.emit('signed-in-newuser', userObj.username);
        console.log(`${userObj.username} has signed up and signed in`);
      });
  });
  
  // After a client signs in, joins a new game.  Waits for two clients before starting the game
  // Expected input: (String) 'username'
  socket.on('join', (thisPlayer) => {
    console.log(thisPlayer, ' joined');
    if (Game.players === 0 && Game.isThereTwoPlayers === false) {
      Game.player1 = {
        username: thisPlayer,
      };
      Game.players++;
      console.log('Player One joined: ', Game.player1.username);
      // socket.join(`player${Game.players}`);
      socket.join('player1');
      socket.emit('player1-joined', thisPlayer);
    }
    else if (Game.players === 1 && Game.isThereTwoPlayers === false) {
      Game.player2 = {
        username: thisPlayer,
      };
      Game.players++;
      console.log('Player Two joined: ', Game.player2.username);
      // socket.join(`player${Game.player1.username}`);
      Game.isThereTwoPlayers = true;
      socket.join('player2');
      socket.emit('player2-joined', Game.player2.username);
      // io.emit('ready-to-play', 'Game ready to begin!');
      // At this point waiting to hear 'play' emit from two clients
    }
    else if (Game.isThereTwoPlayers === true) {
      Game.spectators.push(JSON.stringify(thisPlayer).toString());
      console.log('spectators: ', Game.spectators);
      spectators.emit('spectate', Game.spectators);  // Dunno if this'll work out, makes an array of all who join after the first two needed to start a game.
    }
  });
  
  //  Runs game related functions from game-engine.js
  // wait for both players before starting
  socket.on('play', () => {
    // console.log('play triggered');
    // playCount++;
    // console.log(playCount);
    // if (playCount == 2) {
    console.log('players joined, game starting');
    //  Input is an array of two player objects
    let bothPlayerObjs = [Game.player1, Game.player2];
    //  This loop runs until the game is completed or the players quit
    while(Game.gameover !== true) {
      Game.playerTracker = 1;
      __getClientInput();
      Game.applyInput(Game.currentInput);
      Game.playerTracker = 2;
      __getClientInput();
      Game.applyInput(Game.currentInput);

    }
    bothPlayerObjs.forEach((player) => {
      __determineWinner(player);
    });
    //  Function for dealing with a completed game
    //  Closing out the game session
    Game.endSession();  //  If spectating makes it in, this should pass in spectators array as a second parameter as well.
    
    // }
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
  const  __getClientInput = () => {
    if(Game.playerTracker === 1) {  
      console.log('player1\'s turn');
      socket.emit('input-request-p1');
      socket.on('input-p1', (input) => {
        console.log('Player 1 input:', input);
        Game.currentInput = input.toString();
      });
    }
    if(Game.playerTracker === 2) {
      console.log('player2\'s turn');  
      socket.emit('input-request-p2');
      socket.on('input-p2', (input) => {
        console.log('player 2 input:', input);
        Game.currentInput = input.toString();
      });
    }
  };
  const __determineWinner = (player) => {
    if(player.didIWin === true) {
      console.log(`${player.username} won, storing results...`);
      superagent.post(`${process.env.API_URL}/singlestat`)
        .send(JSON.stringify({name: player.username, win: player.didIWin}))
        .then(() => {
          console.log(`Results saved for ${player.username}`);  
          socket.in(`${player.username}`).emit('won');
          player.didIWin = undefined;
        })
        .catch(err => console.log(err));
    }
    else if(player.didIWin === false) {
      console.log(`${player.username} lost, storing results...`);
      superagent.post(`${process.env.API_URL}/singlestat`)
        .send(JSON.stringify({name: player.username, win: player.didIWin}))
        .then(() => {
          console.log(`Results saved for ${player.username}`);
          player.didIWin = undefined;
          socket.in(`${player.username}`).emit('lost');
        })
        .catch(err => console.log(err));
    }
    else {
      console.log('Something went wrong determining the winner');
    }
  };
});


//  --- EXPORTS -----------------------------------

const start = (port) => {
  ioserver.listen(port, () => {
    console.log('Game Server Listening');
  });
};

module.exports = start;