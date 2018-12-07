'use strict';

// let getWord = require('./word_logic/getWord.js');

// let guessesRemainingSetting = 3;

// var guessesRemaining = guessesRemainingSetting;
// // var guessesSoFar = [];
// // let hint = '';

// const gameState = {
//   wordObject: getWord(),
//   guessesRemaining: guessesRemainingSetting,
//   guessesSoFar: [],
//   hint: '',
// };

function GameState(wordObject, guessesRemaining, hint) {
  this.wordObject = wordObject;
  this.guessesRemaining = guessesRemaining;
  this.guessesSoFar = [];
  this.hint = hint;
}

module.exports = GameState;