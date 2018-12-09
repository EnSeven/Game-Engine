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


// -------- game beginning logic --------
function requestGameState() {
  return localServer.retrieveGameState();
}

function requestWelcomeMessage() {
  return localServer.retrieveWelcomeMessage();
}

let welcomeMessage = requestWelcomeMessage();
console.log(chalk.cyan(welcomeMessage));

let gameState = requestGameState();
promptInquirer(gameState);
// --------------------------------------

module.exports = promptInquirer, requestGameState;

let functionsToEvaluate = {
  // This would be run at the end of the game to check if the user wants to play again

  // function resetGame(outcome, gameState) {
  //   //the below code is for resetting the game and prompting for a replay
  //   gameState.wordObject = getWord();
  //   gameState.wordObject.generateLetters();
  //   gameState.guessesRemaining = gameState.guessesRemainingSetting;
  //   gameState.guessesSoFar = [];
  //   gameState.hint = '';
  
  //   inquirer.prompt([
  //     {
  //       message: messages.replay,
  //       name: 'confirm',
  //       type:'confirm',
  //     },
  //   ]).then(function(response) {
  //     if(evaluateResponse(response) == 'skip') {
  //       return 'skip';
  //     }
  //   });
  // }

  // This would be called after the above

  // function evaluateResetResponse(response) {
  //   if (response.confirm) {
  //     console.log(chalk.cyan('\nGreat! The Word Wizard is conjuring a new word...'));
  //     // main();
  //   } else {
  //     console.log(chalk.cyan('\nThe Word Wizard is displeased!\n'));
  //     return;
  //   }
  // }
};