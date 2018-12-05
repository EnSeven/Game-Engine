function getWords(){
  let Word = require('./Word.js');
  let words1 = {
    word: ['Whickersham', 'Bellingham', 'Okanogan', 'Bellevue', 'Tacoma', 'Eatonville', 'Vancouver', 'Graham','Puyallup','Renton','Leavenworth'],
    hint: ['Located in Whatcom County', 'Near the Canadian Border', 'East of the Cascades', 'Fancy City', 'Port City','Makes You Hungry','Surprisingly Not in Canada', 'Where Hollie Lives','Native American tribe','Boeing has a factory here','Tiny Germany'],
    category: 'Places in Washington'
  };
  let words2 = {
    word: ['Bulldog', 'GermanShepherd', 'Labrador', 'Beagle', 'Poodle', 'Chihuahua', 'Pug', 'Boxer', 'Akita','Pomeranian','Pointer'],
    hint: ['Originates in the UK', 'BARK BARK that\'s the sound of the police!', 'A place in Canada', 'Great for hunting', 'Rhymes with noodle', 'A place in Mexico', 'Slowly suffocating. Poor doggos!', 'A fighter','Big dog from Japan','Fluffy ball of anger','Which way did you say to go?'],
    category: 'Dog Breeds'
  };
  let words3 = {
    word: ['Node', 'Inheritance', 'ASYNC', 'Buffers', 'CRUD', 'Authentication', 'Oauth', 'LinkedList','BigO','HTTP','Class'],
    hint: ['No Dutch', 'People argue about this', 'Almost a popular boy band', 'Waiting for a video to load', 'Nice way to say damn it!', 'Yes you are who you say you are', 'Are you really who you say you are', 'Useful for going backwards on websites','Describes the complexity of an algorithm','A type of transfer protocol','Special functions'],
    category: 'Things We Learned at CodeFellows'
  };
  let words4 = {
    word: ['Ottawa', 'Havana', 'Hanoi', 'London', 'Madrid', 'Riyadh','Islamabad','Rome','Beijing','Quito','Suva'],
    hint: ['Capital of Canada', 'Capital of Cuba', 'Capital of Vietnam', 'Capital of the United Kingdom', 'Capital of Spain', 'Capital of Saudi Arabia','Capital of Pakistan','Capital of Italy','Capital of China','Capital of Ecuador','Capital of Fiji'],
    category: 'Capitals of the World'
  };
  let words5 = {
    word: ['Nissan','Mitsubishi','Renault','Geely','Jeep','Ford','Lada','Lamborghini','Tesla','Hyundai','Lexus'],
    hint: ['Japanese brand that produced the GTR','Japanese brand that produced the Eclipse','French automotive group','Chinese automotive group','Originates from WW2','Just decided to stop making cars','Russian automotive group','Italian brand that started by making tractors','Elon Musks brand','Korean automaker of the Elantra','Fancy Toyota'],
    category: 'Car Companies from Around the World'
  };
  let changeTheNameOfThisVariable1 = {
    word: ['AliceInChains', 'Soundgarden', 'PearlJam', 'Nirvana', 'Mudhoney', 'FooFighters', 'ScreamingTrees', 'MadSeason', 'TempleoftheDog', 'Candlebox', 'TheJimiHendrixExperience'],
    hint: ['Jerry Cantrell', 'KimThayil', 'Mike McCready', 'Kurt Cobain', 'Steve Turner', 'Dave Grohl', 'Gary Lee Connor', 'Mike McCready', 'Mike McCready','Peter Klett', 'Jimi Hendrix'],
    category: 'Seattle Bands'
  };
  let trees = {
    word: ['elm', 'oak', 'maple', 'douglasfir', 'birch', 'spruce', 'juniper', 'weepingwillow', 'pecan', 'cedar', 'walnut'],
    hint: ['Nightmarish', 'Drops acorns', 'syrupy', 'christmas tree', 'its bark makes canoes', 'only hardwood with aircraft grade strength-to-weight-ratio', 'smells like gin', 'sad tree', 'pie tree', 'good for humidors', 'gun stock material'],
    category: 'North American Trees'
  };

  let allWords = [words1, words2, words3, words4, words5, changeTheNameOfThisVariable1, trees];
  let rando1 = Math.floor(Math.random() * words1.word.length);
  let rando2 = Math.floor(Math.random() * allWords.length);
  let randomWord = {
    word: allWords[rando2].word[rando1],
    hint: allWords[rando2].hint[rando1],
    category: allWords[rando2].category
  };
  return new Word(randomWord.word, randomWord.hint, randomWord.category); 
};

module.exports = getWords;
