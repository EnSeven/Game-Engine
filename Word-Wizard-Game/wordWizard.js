#!/usr/bin/env node
var chalk = require('chalk');
var inquirer = require('inquirer');
let newWord = require('./allWords.js');
let correctWord = newWord();

correctWord.generateLetters();
var guessesRemaining = 10;
var guessesSoFar = [];
let hint = '';

console.log(chalk.cyan("\nWelcome to Word Wizard!"));

// Reset function
function endGame(outcome) {
  if (outcome === 'winner') {
    console.log(chalk.blue.bold("\nPraise the Word Wizard! You have won!"));
    console.log(chalk.yellow("You guessed ") + chalk.cyanBright.bold(correctWord.correctWord.toUpperCase()) + " " + chalk.yellow("with " + (guessesRemaining) + " guesses remain.") + "\n");
  } else {
    console.log("\n" + chalk.bgRed.white.bold("You have lost! The Word Wizard is displeased..."));
    console.log(chalk.yellow("The correct word was: ") + chalk.yellow(correctWord.correctWord + ".") + "\n");
  };

  correctWord = newWord();
  correctWord.generateLetters();
  guessesRemaining = 10;
  guessesSoFar = [];
  hint = '';

  inquirer.prompt([
    {
      message: "Foolish mortal! Do you dare to play the Word Wizard again!?",
      name: "confirm",
      type: "confirm",
    }
  ]).then(function(response) {
    if (response.confirm) {
      console.log(chalk.cyan("\nGreat! The Word Wizard is conjuring a new word..."));
      main();
    } else {
      console.log(chalk.cyan("\nThe Word Wizard is displeased!\n"));
      return;
    };
  });
};

// Main game
function main() {
  inquirer.prompt([
    {
      name: "guess",
      prefix: '',
      message: "\nWord: " + chalk.cyanBright(correctWord.update()) +
        "\n\nGuesses remaining: " + chalk.magenta.bold(guessesRemaining) +
        "\nIncorrect guesses so far: " + chalk.magenta.bold(guessesSoFar.join(' ')) + "\n" +
        "\nCategory: " + chalk.yellow(correctWord.category) + "\n" +
        "\nHint: " + chalk.red(hint) + "\n" +
        "Guess a letter:"
    }
  ]).then(function (data) {
    
    // Validate user input
    if (data.guess === "") {
      console.log(chalk.bgRed.white("\nWHOOPS!") + chalk.yellow(" You did not enter a letter."));
      return main();
    } else if (data.guess.length > 1) {
      console.log(chalk.bgRed.white("\nWHOOPS!") + chalk.yellow(" One letter at a time, friend..."));
      return main();
    } else if (guessesSoFar.includes(data.guess)) {
      console.log(chalk.bgRed.white("\nWHOOPS!") + chalk.yellow(" You already guessed that! Choose another letter."));
      return main();
    };

    // Only decrement guessesRemaining on an incorrect guess
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
    main();
  });
};
// var scoreboard = {Player1: 0, Player2:0};
// function updateScoreBoard (winner) {
//     if (++scoreboard[winner]==3) {
//         setMessage("Game over! " + winner + " has won three matches");
//     }
// }
// updateScoreBoard;
main();