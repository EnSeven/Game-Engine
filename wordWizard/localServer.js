'use strict';
var wordWizard = require('./wordWizard.js');

function passInput(data, gameState, promptInquirer) {
  wordWizard.handleInput(data, gameState, promptInquirer);
}

function retrieveGameState() {
  let gameState = wordWizard.gameStateGenerator();
  return gameState;
}

module.exports = {passInput, retrieveGameState};