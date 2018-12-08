'use strict';
let chalk = require('chalk');
let inquirer = require('inquirer');

// TODO: this variable and its use will be replaced with Socket.io
let localServer = require('./localServer.js');

function promptInquirer(gameState) {
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
    // data is an object which contains the player's guess, retrieved from prompt
    // gameState is the object tracking the word and guesses
    // promptInquirer passed as a callback
  ]).then( (data) => {
    let promptResults = {
      data: data,
      gameState: gameState,
      callBack: promptInquirer,
    };
    localServer.passInput(promptResults); 
  })
    .catch((error) => {
      console.log(error);
    });
}

function evaluateResponse(response) {
  if (response.confirm) {
    console.log(chalk.cyan('\nGreat! The Word Wizard is conjuring a new word...'));
    // main();
  } else {
    console.log(chalk.cyan('\nThe Word Wizard is displeased!\n'));
    return;
  }
}

function requestGameState() {
  let gameState = localServer.retrieveGameState();
  return gameState;
}

let gameState = requestGameState();
promptInquirer(gameState);

module.exports = promptInquirer, requestGameState;