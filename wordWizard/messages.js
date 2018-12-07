const static = {
    welcomeMessage: '\nWelcome to Word Wizard!',
    win: '\nPraise the Word Wizard! You have won!',
    loss: 'You have lost! The Word Wizard is displeased...',
    replay: 'Foolish mortal! Do you dare to play the Word Wizard again!?',
    replayConfirm: '\nGreat! The Word Wizard is conjuring a new word...',
    replayDecline:'\nThe Word Wizard is displeased!\n',
    whoops: '\nWHOOPS!',
    noLetter: ' You did not enter a letter.',
    tooManyLetters: ' One letter at a time, friend...',
    repeatLetter: ' You already guessed that! Choose another letter.',
};

function correctWord(correctWord) {
    return chalk.yellow('The correct word was: ') + chalk.yellow(correctWord.correctWord + '.') + '\n';
}

function gameStatus(correctWord, guessesRemaining, guessesSoFar, hint) {
    return '\nWord: ' + chalk.cyanBright(correctWord.update()) +
    '\n\nGuesses remaining: ' + chalk.magenta.bold(guessesRemaining) +
    '\nIncorrect guesses so far: ' + chalk.magenta.bold(guessesSoFar.join(' ')) + '\n' +
    '\nCategory: ' + chalk.yellow(correctWord.category) + '\n' +
    '\nHint: ' + chalk.red(hint) + '\n' +
    'Guess a letter:'
}
 

module.exports = static, correctWord, gameStatus;
