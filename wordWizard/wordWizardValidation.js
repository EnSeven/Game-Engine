'use strict';
var chalk = require('chalk');

function validateUserInput(guess, guessesSoFar) {
    // Validate user input
    if (guess === "") {
      console.log(chalk.bgRed.white("\nWHOOPS!") + chalk.yellow(" You did not enter a letter."));
      return main();
    } else if (guess.length > 1) {
      console.log(chalk.bgRed.white("\nWHOOPS!") + chalk.yellow(" One letter at a time, friend..."));
      return main();
    } else if (guessesSoFar.includes(guess)) {
      console.log(chalk.bgRed.white("\nWHOOPS!") + chalk.yellow(" You already guessed that! Choose another letter."));
      return main();
    };
  }

  module.exports = {validateUserInput};