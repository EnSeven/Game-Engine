'use strict';
var chalk = require('chalk');
var inquirer = require('inquirer');
var wordWizard = require('./wordWizard.js');

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
  ]).then( (data) => wordWizard.handleInput(data, gameState, promptInquirer) );
}


promptInquirer(wordWizard.gameState);