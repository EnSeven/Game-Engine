'use strict';

const Game = {
  gameover: false,
  isThereTwoPlayers: false,
  players: 0,
  player1: {},
  player2: {},
  spectators: [],
  playerTracker: 0,
  currentInput: '',
  inputLog: [],
  testGame: 0,

  getClientInput: () => {
    if(Game.playerTracker === 1) {  
      players.in(`player1`).emit('input-request');
      players.in('player1').on('input', (socket) => {
        Game.currentInput = socket.toString();
        Game.playerTracker = 2; 
      });
    }
    if(Game.playerTracker === 2) {  
      players.in(`player2`).emit('input-request')
      players.in('player2').on('input', (socket) => {
        Game.currentInput = socket.toString();
        Game.playerTracker = 1; 
      });
    }
  },

  applyInput: (input) => {
    // The parameter is the input from the current player client.  Use this as the inputs for the game.
    Game.inputLog.push(input);
    Game.__game(input);
  },

  //  The first to join is player1, the next is player2, all others after that are spectators
  joinGame: (socket) => {
    console.log('testing', Game.players);
    if (Game.players === 0 && Game.isThereTwoPlayers === false) {
      Game.player1 = {
        username: socket,
      };
      Game.players++;
      console.log('Player One joined: ', Game.player1.username);
      // socket.join(`player${Game.players}`);
    }
    else if (Game.players === 1 && Game.isThereTwoPlayers === false) {
      Game.player2 = {
        username: socket,
      };
      Game.players++;
      console.log('Player Two joined: ', Game.player2.username);
      // socket.join(`player${Game.player1.username}`);
      Game.isThereTwoPlayers = true;
      socket.emit('player2-joined', Game.player2.username);
      // io.emit('ready-to-play', 'Game ready to begin!');
      // At this point waiting to hear 'play' emit from two clients
    }
    else if (Game.isThereTwoPlayers === true) {
      Game.spectators.push(JSON.stringify(socket.req.data).username.toString());
      console.log('spectators: ', Game.spectators);
      spectators.emit('spectate', Game.spectators);  // Dunno if this'll work out, makes an array of all who join after the first two needed to start a game.
    }
  },
      
  // Takes the player1 and player2 objects in an array
  // Determines and notifies winner and loser, and posts stats to API server
  determineWinner: (bothPlayers) => {
    bothPlayers.forEach((player) => {
      if(player.didIWin === true) {
        console.log(`${player.username} won, storing results...`);
        superagent.post(`${process.env.API_URL}/singlestat`)
          .send(`{'name' : ${player.username}, 'win' : ${player.didIWin}`)
          .then(() => {
            console.log(`Results saved for ${player.username}`);  
            player.didIWin = undefined;
            socket.in(`player${player.username}`).emit('won');
          })
          .catch(err => console.log(err));
      }
      else if(player.didIWin === false) {
        console.log(`${player.username} lost, storing results...`);
        superagent.post(`${process.env.API_URL}/singlestat`)
          .send(`{'name' : ${player.username}, 'win' : ${player.didIWin}`)
          .then(() => {
            console.log(`Results saved for ${player.username}`);
            player.didIWin = undefined;
            socket.in(`player${player.username}`).emit('lost');
          })
          .catch(err => console.log(err));
      }
      else {
        console.log('Something went wrong determining the winner');
      }
    });
  },

  quit: () => {
    // get both players to send quit events 
    let quitCount = 0;
    socket.emit('confirm-quit');
    socket.on('quit-confirmed', () => {
      quitCount++;
    });
    while(quitCount === 2) {
      Game.endSession();
      io.emit('end');
      io.removeAllListeners();
      quitCount = 0;
    }
  },

  endSession: () => {
    //  Dump all session data
    Game.isThereTwoPlayers = false;
    Game.players = 0;
    Game.player1 = {};
    Game.player2 = {};
    Game.spectators = [];
  },

  ///////////////////////  GAME LOGIC  ///////////////////
  __game: (input) => {
    // Actual game logic goes here
    // If we're lucky it can be easily modularized to other files
    // All this is test stuff
    console.log('playing the game...');
    Game.testGame++;
    if(Game.testGame === 2) {
      Game.player1.didIWin = false;
      Game.player2.didIWin = true;
      Game.gameover = true;
    }
  },
};

module.exports = Game;