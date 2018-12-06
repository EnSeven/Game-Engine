const client = require('socket.io-client')();
let socket = client.connect();
const game = module.exports = {};


game.signin = () => {
  socket.emit('login', '', (payload) => console.log(payload));
  let message = 'you are signed in';
  console.log(message);
};
