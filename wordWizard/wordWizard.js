#!/usr/bin/env node
var chalk = require('chalk');
var inquirer = require('inquirer');
let newWord = require('./word_logic/allWords.js');
let messages = require('./messages.js');
let validation = require('./wordWizardValidation.js');

let correctWord = newWord();

correctWord.generateLetters();

var guessesRemainingSetting = 3;
var guessesRemaining = guessesRemainingSetting;
var guessesSoFar = [];
let hint = '';


function evaluateResponse(response) {
  if (response.confirm) {
    console.log(chalk.cyan("\nGreat! The Word Wizard is conjuring a new word..."));
    main();
  } else {
    console.log(chalk.cyan("\nThe Word Wizard is displeased!\n"));
    return 'skip';
  };
}

function endGameLog(outcome) {
  if (outcome === 'winner') {
    console.log(chalk.blue.bold("\nPraise the Word Wizard! You have won!"));
    console.log(chalk.yellow("You guessed ") + chalk.cyanBright.bold(correctWord.correctWord.toUpperCase()) + " " + chalk.yellow("with " + (guessesRemaining) + " guesses remain.") + "\n");
  } else {
    console.log("\n" + chalk.bgRed.white.bold("You have lost! The Word Wizard is displeased..."));
    console.log(chalk.yellow("The correct word was: ") + chalk.yellow(correctWord.correctWord + ".") + "\n");
  };
}

// Reset function
function endGame(outcome) {

  endGameLog(outcome);

  correctWord = newWord();
  correctWord.generateLetters();
  guessesRemaining = guessesRemainingSetting;
  guessesSoFar = [];
  hint = '';

  inquirer.prompt([
    {
      message: messages.replay,
      name: "confirm",
      type:"confirm",
    }
  ]).then(function(response) {
    if(evaluateResponse(response) == 'skip') {
      return 'skip';
    };
  });

};

function evaluateUserInput(guess) {
  if (!correctWord.correctWord.includes(guess)) {
    guessesRemaining--;
  }
  guessesSoFar.push(guess.toUpperCase());

  for (var i = 0; i < correctWord.letters.length; i++) {
    correctWord.letters[i].check(guess);
  };
  if (correctWord.update().toLowerCase() == correctWord.correctWord.toLowerCase()) {
    return endGame('winner');
  };
  if (guessesRemaining < 6) {
    hint = correctWord.hint;
  };
  if (guessesRemaining == 0) {

    return endGame('loss');
  };
}


// Main game

// export this to 
function handleInput(data, cb) {

  validation.validateUserInput(data.guess, guessesSoFar);
  
  // Only decrement guessesRemaining on an incorrect guess
  // ---- function-wrap this
    if (!correctWord.correctWord.includes(data.guess)) {
      guessesRemaining--;
    }
    guessesSoFar.push(data.guess.toUpperCase());

    for (var i = 0; i < correctWord.letters.length; i++) {
      correctWord.letters[i].check(data.guess);
    };
    if (correctWord.update().toLowerCase() == correctWord.correctWord.toLowerCase()) {
      endGame('winner');
      return;
    };
    if (guessesRemaining < 6) {
      hint = correctWord.hint;
    };
    if (guessesRemaining == 0) {
      endGame('loss');
      return;
    };
    // only called if validateUserInput is called with a function in addition to the data
    if ( typeof cb === "function" ) { cb(); }
}

console.log(chalk.cyan(messages.welcomeMessage));

const main = function() {
  inquirer.prompt([
    {
      name: "guess",
      prefix: '',
      message: "\nWord: " + chalk.cyanBright(correctWord.update()) +
        "\n\nIncorrect guesses remaining: " + chalk.magenta.bold(guessesRemaining) +
        "\nGuesses so far: " + chalk.magenta.bold(guessesSoFar.join(' ')) + "\n" +
        "\nCategory: " + chalk.yellow(correctWord.category) + "\n" +
        "\nHint: " + chalk.red(hint) + "\n" +
        "Guess a letter:"
    }
  ]).then( (data) => handleInput(data, main) );
};




module.exports = {main, handleInput};