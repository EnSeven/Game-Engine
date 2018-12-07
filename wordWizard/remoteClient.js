'use strict';
var chalk = require('chalk');
var inquirer = require('inquirer');
var wizard = require('./wordWizard.js');

require('./wordWizard.js');

function promptInquirer(wordObject, guessesRemaining, guessesSoFar, hint) {
  inquirer.prompt([
    {
      name: 'guess',
      prefix: '',
      message: '\nWord: ' + chalk.cyanBright(wordObject.update()) +
        '\n\nIncorrect guesses remaining: ' + chalk.magenta.bold(guessesRemaining) +
        '\nGuesses so far: ' + chalk.magenta.bold(guessesSoFar.join(' ')) + '\n' +
        '\nCategory: ' + chalk.yellow(wordObject.category) + '\n' +
        '\nHint: ' + chalk.red(hint) + '\n' +
        'Guess a letter:',
    },
  ]).then( (data) => wizard.handleInput(data) );
}


promptInquirer(wizard.correctWord, wizard.guessesRemaining, wizard.guessesSoFar, wizard.hint);