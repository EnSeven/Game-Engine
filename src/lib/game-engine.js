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

  applyInput: (input) => {
    // The parameter is the input from the current player client.  Use this as the inputs for the game.
    Game.inputLog.push(input);
    console.log(input);
    Game.testGame++;
    console.log('Playing the game...', Game.testGame);
    if(Game.testGame > 3) {
      Game.player1.didIWin === true;
      Game.gameover = true;
    }
  },
      
  endSession: () => {
    //  Dump all session data
    Game.isThereTwoPlayers = false;
    Game.players = 0;
    Game.player1 = {};
    Game.player2 = {};
    Game.spectators = [];
    console.log('Game session cleared.');
  },

  ///////////////////////  GAME LOGIC  ///////////////////

};
module.exports = Game;