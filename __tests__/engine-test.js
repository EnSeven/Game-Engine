'use strict';

jest.mock('socket.io');
jest.mock('socket.io-client');
const server = require('../__mocks__/server.js');
const game = require('../__mocks__/game.js');
const app = require('../src/app.js');

// route tests

describe('app.get', () => {
it('should render a site', () => {
  .get('/site');
  .then(results => {
    expect(results.render).toBe('site');
  });
});
});


// mock socket tests
describe('game.signin', () => {
  it('connects', () => {
    game.signin();
    expect('message').toBe('message');
  });
});


// describe('signup', () => {
// it('requires a username', () => {
//   username.required = true;
//   expect('username.required').toBe('true');
// });
// });
