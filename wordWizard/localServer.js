'use strict';
var wordWizard = require('./wordWizard.js');

function passInput(promptResults) {
  wordWizard.handleInput(promptResults);
}

function retrieveGameState() {
  return wordWizard.gameStateGenerator();
}

function retrieveWelcomeMessage() {
  return wordWizard.provideWelcomeMessage();
}

module.exports = {passInput, retrieveGameState, retrieveWelcomeMessage};