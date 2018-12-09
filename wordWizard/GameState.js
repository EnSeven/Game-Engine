'use strict';
function GameState(wordObject, guessesRemainingSetting, hint) {
  this.wordObject = wordObject;
  this.guessesRemainingSetting = guessesRemainingSetting;
  this.guessesRemaining = guessesRemainingSetting;
  this.guessesSoFar = [];
  this.hint = hint;
}

module.exports = GameState;