'use strict';

//  --- DEPENDANCIES ------------------------------

require('dotenv').config();
const Game = require('./lib/game-engine.js');
const superagent = require('superagent');
const ioserver = require('http').createServer(8080);
const io = require('socket.io')(ioserver);
let socketConnections = [];



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
    console.log(`${socket.id} has left the game`);
  });
  
  // handles logins for new and returning clients.  Expected input: (Object) {username: 'username', password: 'password', email: 'email'}
  socket.on('sign-in', (userObj) => {
    console.log(userObj);
    superagent.post(`https://${userObj.username}:${userObj.password}@enseven-api-service.herokuapp.com/signin`)
      .set('Content-Type', 'application/json')
      .then(data => {
        userObj.auth = data.text;
        socket.emit('signed-in-user', userObj);
        console.log(`Returning user ${userObj.username} has signed in`);
      })
      .catch(error => {
        console.log('Error signing in', error);
      });
  });
      
  socket.on('sign-up', (userObj) => {
    superagent.post(`${process.env.API_URL}/signup`)
      .send(JSON.stringify(userObj))
      .set('Content-Type', 'application/json')
      .then(data => {
        console.log(data);
        userObj.auth = data.text;
        // console.log(userObj);
        socket.emit('signed-in-newuser', userObj);
        console.log(`${userObj.username} has signed up and signed in`);
      })
      .catch(err => console.log(err));
  });
  
  // After a client signs in, joins a new game.  Waits for two clients before starting the game
  // Expected input: (String) 'username'
  socket.on('join', (thisPlayer) => {

    if (Game.players === 0) {
      Game.player1 = {
        username: thisPlayer.username,
        auth: thisPlayer.auth,
        player: 'one',
        didIWin: undefined,
      };
      Game.players++;
      // console.log('Player One joined: ', Game.player1);
      socket.emit('player1-joined', Game.player1);
    }
    // else if (Game.players === 1 && Game.isThereTwoPlayers === false) {
    //   Game.player2 = {
    //     username: thisPlayer.username,
    //     auth: thisPlayer.auth,
    //     player: 'two',
    //   };
    //   Game.players++;
    //   // console.log('Player Two joined: ', Game.player2);
    //   // socket.join(`player${Game.player1.username}`);
    //   Game.isThereTwoPlayers = true;
    //   socket.emit('player2-joined', Game.player2);
    //   // io.emit('ready-to-play', 'Game ready to begin!');
    //   // At this point waiting to hear 'play' emit from two clients
    // }
    else {
      console.log('Something went wrong determining player');
    }
  });
  
  const getInput = () => {
    console.log('emitting input request');
    socket.emit('input-request', output);
  };
  let output;
  socket.on('play', () => {
    getInput();
  }); 
  socket.on('input', input => {
    if(Game.gameover === true) {
      __determineWinner(Game.player1);
      Game.endSession();
    }
    else if(Game.gameover === false) {
      console.log('applying input');
      console.log(input.letter);
      output = 'this is output from the game';
      Game.testGame++;
      console.log('Playing the game...', Game.testGame);
      if(Game.testGame < 3) {
        Game.player1.didIWin = true;
        Game.gameover = true;
      }
      getInput();
    }
  });
  
  
  
  // Listens for quit event from either client during play.  Will confirm the quit with both players
  socket.on('quit-game', () => {
    // get both players to send quit events 
    let quitCount = 0;
    socket.emit('confirm-quit');
    socket.on('quit-confirmed', () => {
      quitCount++;
    });
    while(quitCount === 2) {
      Game.endSession();
      socket.emit('end');
      socket.removeAllListeners();
      quitCount = 0;
    }
    socket.emit('end');
  });
  
  const __determineWinner = (player) => {
    console.log(player);
    if(Game.player1.didIWin === true) {
      console.log(`${player.username} won, storing results...`);
      superagent.post(`${process.env.API_URL}/api/v1/singlestat`)
        .send({name: player.username, win: player.didIWin})
        .set('Authorization', `Bearer ${player.auth}`)
        .then(() => {
          socket.emit('won');
          console.log(`ASYNC: Results saved for ${player.username}`);  
          player.didIWin = undefined;
        })
        .catch(err => console.log(err));
    }
    else if(Game.player1.didIWin === false) {
      console.log(`${player.username} lost, storing results...`);
      superagent.post(`${process.env.API_URL}/api/v1/singlestat`)
        .send({name: player.username, win: player.didIWin})
        .set('Authorization', `Bearer ${player.auth}`)
        .then(() => {
          console.log(`ASYNC: Results saved for ${player.username}`);
          player.didIWin = undefined;
          socket.emit('lost');
        })
        .catch(err => console.log('3'));
    }
    else {
      console.log('Something went wrong determining the winner:', player);
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