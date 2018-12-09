'use strict';

const io = require('socket.io-client');
const socket = io('http://localhost:3000');


socket.sockets.on('connection', (socket) => {
  socket.on('connected', (socket) => {
    socket.username = 'username';
    socket.password = 'password';
    socket.email = 'email@email.com';
    socket.emit('sign-in', socket);
  });
});














// socket.on('connected', (user) => {
//   // console.log('socket:', socket);
//   //  get input, create object with username, email, and password field
  
//   /////////////////  SIGNIN / SIGNUP  ////////////////////
  
//   user.emit('sign-in', user);

//   socket.on('signing-in', 'User found, signing in...');

//   socket.on('confirm-sign-up', 'User not found.  Create account?', () => {
//     // Just needs to press enter or something to trigger
//     console.log('signing up');
//     socket.emit('sign-up-confirmed');
//   });

//   /////////////////  JOINING A GAME  ////////////////////

//   // These next two code blocks should function identically, it's separated for new or returning users
//   socket.on('signed-in-newuser', `Account created for ${socket.username} and signed in!`, () => {
//     // Get input to start/join a game
//     socket.emit('join', socket);
//   });
//   socket.on('signed-in', `Welcome back, ${socket.username}!`, () => {
//     // Get input to start/join a game
//     socket.emit('join', socket);
//   });
  
//   players.on(`player1-joined`, `${socket.username} has joined as player one`);
//   players.on('player2-joined', `${socket.username} has joined as player two`);
//   console.log('1');
//   socket.on('ready-to-play', (socket) => {
//     // 'ready-to-play' is sent to all sockets, server waits to hear back from both players that they're ready
//     players.emit('play');
//     console.log('2');
//   });

//   /////////////////  PLAYING A GAME  ////////////////////

//   players.on('input-request', () => {
//     //  Server is only listening for the current player's input, even if both send something
//     //  Client is propted to type something and hit enter
//     socket.input = 'input';
//     //  should emit 'input' event with input attached after pressing enter
//     players.emit('input', socket.input);
//   });

//   /////////////////  OTHER FUNCTIONS  ////////////////////

//   // Gets a player's stats.  Currently need to be a player in a game to access
//   players.emit('get-stats', socket.username, () => {
//     players.on('stats', (stats) => {
//       console.log(stats);
//     });
//   });

//   // This would trigger when 1 client tries to quit a game
//   players.emit('quit-game', () => {
//     players.on('confirm-quit', () => {
//       // Sends 'confirm-quit' event to both players and waits to hear two 'quit-confirmed' events before proceeding
//       players.emit('quit-confirmed');
//     });
//   });

//   // spectators leaving the game
//   spectators.emit('leave-game', socket.username);

//   // Ending the game
//   socket.on('end', () => {
//     // At this point all game session data is cleared and communication with the server ceases until a new 'start' emit
//     // Use this to shut down the client or start a new game
//   });
// });