'use strict';

const io = require('socket.io-client');
const socket = io.connect('https://enseven-game-engine.herokuapp.com');
const players = socket('/players');
const spectators = socket('/spectators');



socket.emit('start');

socket.on('connected', (socket) => {
  //  get input, create object with username, email, and password field
  socket.username = 'username';
  socket.password = 'ppassword';
  socket.email = 'email';

  socket.emit('sign-in', socket);

  socket.on('signing-in', 'User found, signing in...');

  socket.on('confirm-sign-up', 'User not found.  Create account?', () => {
    // Just needs to press enter or something to trigger
    socket.emit('sign-up-confirmed');
  });

  // These next two code blocks should function identiacally, separated for new or returning users
  socket.on('signed-in-newuser', `Account created for ${socket.username} and signed in!`, () => {
    // Get input to start/join a game
    socket.emit('join', socket);
  });
  socket.on('signed-in', `Welcome back, ${socket.username}!`, () => {
    // Get input to start/join a game
    socket.emit('join', socket);
  });
  
  players.in(`player1`).on(`player1-joined`, `${socket.username} has joined as player one`);
  players.in('player2').on('player2-joined', `${socket.username} has joined as player two`);
 
  socket.on('ready-to-play', (socket) => {
    // 'ready-to-play' is sent to all sockets, server waits to hear back from both players that they're ready
    players.emit('play');
  });

  players.on('input-request', () => {
    //  Server is only listening for one player's input, even if both end some
    socket.input = 'input';
    //  emits 'input' event with input attached after pressing enter
    players.emit('input', socket.input);
  });

  players.emit('get-stats', socket.username, () => {
    players.on('stats', (stats) => {
      console.log(stats);
    });
  });

  // This would trigger when 1 client tries to quit a game
  players.emit('quit-game', () => {
    players.on('confirm-quit', () => {
      // Sends 'confirm-quit' event to both players and waits to hear two 'quit-confirmed' events before proceeding
      players.emit('quit-confirmed');
    });
  });

  // spectators leaving the game
  spectators.emit('leave-game', socket.username);
  socket.on('end', () => {
    // At this point all game session data is cleared and communication with the server ceases until a new 'start' emit
    // Use this to shut down the client or start a new game
  });
});