#!/usr/bin/env node
var chalk = require('chalk');
var inquirer = require('inquirer');
let getWord = require('./word_logic/getWord.js');
let messages = require('./messages.js');
let validation = require('./wordWizardValidation.js');
let GameState = require('./GameState.js');



// var guessesRemaining = guessesRemainingSetting;
// // var guessesSoFar = [];
// // let hint = '';

// const gameState = {
//   wordObject: getWord(),
//   guessesRemaining: guessesRemainingSetting,
//   guessesSoFar: [],
//   hint: '',
// };




//TODO: get wrapped in function
function gameStateGenerator() {
  let wordObject = getWord();
  let guessesRemainingSetting = 3;
  let hint = '';
  const gameState = new GameState(wordObject, guessesRemainingSetting, hint);
  
  gameState.wordObject.generateLetters();
  
  return gameState;
}

let gameState = gameStateGenerator();

function evaluateResponse(response) {
  if (response.confirm) {
    console.log(chalk.cyan('\nGreat! The Word Wizard is conjuring a new word...'));
    // main();
  } else {
    console.log(chalk.cyan('\nThe Word Wizard is displeased!\n'));
    return 'skip';
  }
}

// called in endGame, below
function endGameLog(outcome) {
  if (outcome === 'winner') {
    console.log(chalk.blue.bold('\nPraise the Word Wizard! You have won!'));
    console.log(chalk.yellow('You guessed ') + chalk.cyanBright.bold(gameState.wordObject.correctWord.toUpperCase()) + ' ' + chalk.yellow('with ' + (gameState.guessesRemaining) + ' guesses remain.') + '\n');
  } else {
    console.log('\n' + chalk.bgRed.white.bold('You have lost! The Word Wizard is displeased...'));
    console.log(chalk.yellow('The correct word was: ') + chalk.yellow(gameState.wordObject.correctWord + '.') + '\n');
  }
}

// Reset function
// called in handleInput, below
function endGame(outcome) {

  endGameLog(outcome);

  // gameState.wordObject = getWord();
  // gameState.wordObject.generateLetters();
  // gameState.guessesRemaining = gameState.guessesRemainingSetting;
  // gameState.guessesSoFar = [];
  // gameState.hint = '';

  // inquirer.prompt([
  //   {
  //     message: messages.replay,
  //     name: 'confirm',
  //     type:'confirm',
  //   },
  // ]).then(function(response) {
  //   if(evaluateResponse(response) == 'skip') {
  //     return 'skip';
  //   }
  // });

}

// Main game

// export this
function handleInput(data, gameState, cb) {

  validation.validateUserInput(data.guess, gameState.guessesSoFar);
  
  // Only decrement guessesRemaining on an incorrect guess
  // ---- function-wrap this
  if (!gameState.wordObject.correctWord.includes(data.guess)) {
    gameState.guessesRemaining--;
  }
  gameState.guessesSoFar.push(data.guess.toUpperCase());

  for (var i = 0; i < gameState.wordObject.letters.length; i++) {
    gameState.wordObject.letters[i].check(data.guess);
  }
  if (gameState.wordObject.update().toLowerCase() == gameState.wordObject.correctWord.toLowerCase()) {
    endGame('winner');
    return;
  }
  if (gameState.guessesRemaining < 6) {
    gameState.hint = gameState.wordObject.hint;
  }
  if (gameState.guessesRemaining == 0) {
    endGame('loss');
    return;
  }
  // only called if validateUserInput is called with a function in addition to the data
  if ( typeof cb === 'function' ) { cb(gameState); }
}

//TODO: get wrapped in function
console.log('relocate the console log generating this and the next message');
console.log(chalk.cyan(messages.welcomeMessage));

// main provided for local testing with ./index.js
const main = function() {
  inquirer.prompt([
    {
      name: 'guess',
      prefix: '',
      message: '\nWord: ' + chalk.cyanBright(gameState.wordObject.update()) +
        '\n\nIncorrect guesses remaining: ' + chalk.magenta.bold(gameState.guessesRemaining) +
        '\nGuesses so far: ' + chalk.magenta.bold(gameState.guessesSoFar.join(' ')) + '\n' +
        '\nCategory: ' + chalk.yellow(gameState.wordObject.category) + '\n' +
        '\nHint: ' + chalk.red(gameState.hint) + '\n' +
        'Guess a letter:',
    },
  ]).then( (data) => handleInput(data, gameState, main) );
};

module.exports = {main, handleInput, gameStateGenerator};