#!/usr/bin/env node
let chalk = require('chalk');
let getWord = require('./word_logic/getWord.js');
let messages = require('./messages.js');
let GameState = require('./GameState.js');

//TODO: get wrapped in function
function gameStateGenerator() {
  let guess = '';
  let wordObject = getWord();
  let guessesRemainingSetting = 5;
  let hint = '';
  let gameState = new GameState(guess, wordObject, guessesRemainingSetting, hint);
  
  gameState.wordObject.generateLetters();
  
  return gameState;
}

// -------- logic for outgoing data --------

// displays messages to indicate game outcome
// called in handleInput, under "logic for incoming data"
function endGameLog(outcome, gameState) {
  if (outcome === 'winner') {
    console.log(chalk.blue.bold('\nPraise the Word Wizard! You have won!'));
    console.log(chalk.yellow('You guessed ') + chalk.cyanBright.bold(gameState.wordObject.correctWord.toUpperCase()) + ' ' + chalk.yellow('with ' + (gameState.guessesRemaining) + ' guesses remain.') + '\n');
  } else {
    console.log('\n' + chalk.bgRed.white.bold('You have lost! The Word Wizard is displeased...'));
    console.log(chalk.yellow('The correct word was: ') + chalk.yellow(gameState.wordObject.correctWord + '.') + '\n');
  }
}

// checks to make sure the input is correctly formatted
function validateUserInput(guess, guessesSoFar) {
  if (guess === '') {
    console.log(chalk.bgRed.white('\nWHOOPS!') + chalk.yellow(' You did not enter a letter.'));
    return;
  } else if (guess.length > 1) {
    console.log(chalk.bgRed.white('\nWHOOPS!') + chalk.yellow(' One letter at a time, friend...'));
    return;
  } else if (guessesSoFar.includes(guess)) {
    console.log(chalk.bgRed.white('\nWHOOPS!') + chalk.yellow(' You already guessed that! Choose another letter.'));
    return;
  }
}

function provideWelcomeMessage() {
  return messages.welcomeMessage;
}
// --------------------------------------

// -------- logic for incoming data --------

function handleInput(promptResults) {
  let data = promptResults.data;
  let gameState = promptResults.gameState;
  let cb = promptResults.callBack;

  validateUserInput(data.guess, gameState.guessesSoFar);
  
  // Only decrement guessesRemaining on an incorrect guess
  if (!gameState.wordObject.correctWord.includes(data.guess)) {
    gameState.guessesRemaining--;
  }
  gameState.guessesSoFar.push(data.guess.toUpperCase());

  for (var i = 0; i < gameState.wordObject.letters.length; i++) {
    gameState.wordObject.letters[i].check(data.guess);
  }
  if (gameState.wordObject.update().toLowerCase() == gameState.wordObject.correctWord.toLowerCase()) {
    endGameLog('winner', gameState);
    return;
  }
  if (gameState.guessesRemaining < 6) {
    gameState.hint = gameState.wordObject.hint;
  }
  if (gameState.guessesRemaining == 0) {
    endGameLog('loss', gameState);
    return;
  }
  // only called if validateUserInput is called with a function in addition to the data
  if ( typeof cb === 'function' ) { cb(gameState); }
}
// --------------------------------------

module.exports = {handleInput, validateUserInput, gameStateGenerator, provideWelcomeMessage};