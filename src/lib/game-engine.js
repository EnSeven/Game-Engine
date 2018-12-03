'use strict';

import superagent from 'superagent';


const Game = {
  isThereTwoPlayers: false,
  players: 0,
  player1: {},
  player2: {},
  spectators: [],
  playerTracker: 0,
  currentInput: '',

  getInput: () => {
    if(this.playerTracker === 1) {  
      players.in(`player1`).emit('input-request');
      players.in('player1').on('input', (socket) => {
        this.currentInput = socket;
        this.playerTracker = 2; 
      });
    }
    if(this.playerTracker === 2) {  
      players.in(`player2`).emit('input-request')
      players.in('player2').on('input', (socket) => {
        this.currentInput = socket;
        this.playerTracker = 1; 
      });
    }
  },

  joinGame: (socket) => {
    if (this.players === 0 && this.isThereTwoPlayers === false) {
      this.player1 = {
        username: socket.username,
      };
      this.players++;
      console.log('Player One joined: ', this.player1.username);
      players.join(`player${this.players}`);
      players.emit('player1-joined', this.player1.username);
    }
    else if (this.players === 1 && this.isThereTwoPlayers === false) {
      this.player2 = {
        username: socket.username,
      };
      this.players++;
      console.log('Player Two joined: ', this.player2.username);
      players.join(`player${this.player1.username}`);
      this.isThereTwoPlayers = true;
      players.emit('player2-joined', this.player2.username);
      io.emit('ready-to-play', 'Game ready to begin!');
      // At this point waiting to hear 'play' emit from two clients
    }
    else if (this.isThereTwoPlayers === true) {
      this.spectators.push(JSON.stringify(socket.req.data).username.toString());
      console.log('spectators: ', this.spectators);
      spectators.emit('spectate', this.spectators);  // Dunno if this'll work out, makes an array of all who join after the first two needed to start a game.
    }
  },

  applyInput: (input) => {
    // The parameter is the input from the current player client.  Use this as the inputs for the game.
    let allInputs;
    allInputs.push(input);
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
            players.in(`player${player.username}`).emit('won');
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
            players.in(`player${player.username}`).emit('won');
          })
          .catch(err => console.log(err));
      }
      else {
        console.log('Something went wrong determining the winner');
      }
    });
    io.emit('gameover');
  },

  quit: () => {
    // get both players to send quit events 
    let quitCount = 0;
    players.emit('confirm-quit');
    players.on('confirmed-quit', () => {
      quitCount++;
    });
    while(quitCount === 2) {
      this.endSession();
      io.emit('end');
      io.removeAllListeners();
      quitCount = 0;
    }
  },

  endSession: () => {
    //  Dump all session data
    this.isThereTwoPlayers = false;
    this.players = 0;
    this.player1 = {};
    this.player2 = {};
    this.spectators = [];
  },
};

module.exports = Game;