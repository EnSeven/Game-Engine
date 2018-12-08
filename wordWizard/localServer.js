'use strict';
var wordWizard = require('./wordWizard.js');

function passInput(promptResults) {
  wordWizard.handleInput(promptResults);
}

function retrieveGameState() {
  let gameState = wordWizard.gameStateGenerator();
  return gameState;
}

module.exports = {passInput, retrieveGameState};