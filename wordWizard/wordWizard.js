#!/usr/bin/env node
var chalk = require('chalk');
var inquirer = require('inquirer');
let getWord = require('./word_logic/getWord.js');
let messages = require('./messages.js');
let validation = require('./wordWizardValidation.js');

// let wordObject = getWord();
// wordObject.generateLetters();

var guessesRemainingSetting = 3;

var guessesRemaining = guessesRemainingSetting;
var guessesSoFar = [];
let hint = '';

const gameState = {
  wordObject: getWord(),
  guessesRemaining: guessesRemainingSetting,
  guessesSoFar: [],
  hint: '',
};

//TODO: get wrapped in function
gameState.wordObject.generateLetters();

function evaluateResponse(response) {
  if (response.confirm) {
    console.log(chalk.cyan('\nGreat! The Word Wizard is conjuring a new word...'));
    main();
  } else {
    console.log(chalk.cyan('\nThe Word Wizard is displeased!\n'));
    return 'skip';
  }
}

// called in endGame, below
function endGameLog(outcome) {
  if (outcome === 'winner') {
    console.log(chalk.blue.bold('\nPraise the Word Wizard! You have won!'));
    console.log(chalk.yellow('You guessed ') + chalk.cyanBright.bold(gameState.wordObject.correctWord.toUpperCase()) + ' ' + chalk.yellow('with ' + (guessesRemaining) + ' guesses remain.') + '\n');
  } else {
    console.log('\n' + chalk.bgRed.white.bold('You have lost! The Word Wizard is displeased...'));
    console.log(chalk.yellow('The correct word was: ') + chalk.yellow(gameState.wordObject.correctWord + '.') + '\n');
  }
}

// Reset function
// called in handleInput, below
function endGame(outcome) {

  endGameLog(outcome);

  gameState.wordObject = getWord();
  gameState.wordObject.generateLetters();
  guessesRemaining = guessesRemainingSetting;
  guessesSoFar = [];
  hint = '';

  inquirer.prompt([
    {
      message: messages.replay,
      name: 'confirm',
      type:'confirm',
    },
  ]).then(function(response) {
    if(evaluateResponse(response) == 'skip') {
      return 'skip';
    }
  });

}

// Main game

// export this
function handleInput(data, cb) {

  validation.validateUserInput(data.guess, guessesSoFar);
  
  // Only decrement guessesRemaining on an incorrect guess
  // ---- function-wrap this
  if (!gameState.wordObject.correctWord.includes(data.guess)) {
    guessesRemaining--;
  }
  guessesSoFar.push(data.guess.toUpperCase());

  for (var i = 0; i < gameState.wordObject.letters.length; i++) {
    gameState.wordObject.letters[i].check(data.guess);
  }
  if (gameState.wordObject.update().toLowerCase() == gameState.wordObject.correctWord.toLowerCase()) {
    endGame('winner');
    return;
  }
  if (guessesRemaining < 6) {
    hint = gameState.wordObject.hint;
  }
  if (guessesRemaining == 0) {
    endGame('loss');
    return;
  }
  // only called if validateUserInput is called with a function in addition to the data
  if ( typeof cb === 'function' ) { cb(); }
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
        '\n\nIncorrect guesses remaining: ' + chalk.magenta.bold(guessesRemaining) +
        '\nGuesses so far: ' + chalk.magenta.bold(guessesSoFar.join(' ')) + '\n' +
        '\nCategory: ' + chalk.yellow(gameState.wordObject.category) + '\n' +
        '\nHint: ' + chalk.red(hint) + '\n' +
        'Guess a letter:',
    },
  ]).then( (data) => handleInput(data, main) );
};

module.exports = {main, handleInput};