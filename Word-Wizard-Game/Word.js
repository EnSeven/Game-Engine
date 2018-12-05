var Letter = require('./Letter.js');

function Word(correctWord, hint, category) {
  this.correctWord = correctWord;
  this.category = category;
  this.hint = hint;
  this.letters = [];

  this.generateLetters = function() {
    var correctWordArray = this.correctWord.split('');
    for (var a=0; a < correctWordArray.length; a++) {
      var newLetter = new Letter(correctWordArray[a]);
      this.letters.push(newLetter);
    };
  };

  this.makeGuess = function(guess) {
    for (var b=0; b < this.letters.length; b++) {
      this.letters[b].check(guess);
    };
  };

  this.update = function() {
    var string = ''
    for (var c=0; c < this.letters.length; c++) {
      string += this.letters[c].returnCharacter();
    };
    return string;
  };
};

module.exports = Word;