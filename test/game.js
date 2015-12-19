'use strict';

const assert = require('assert');

const Game = require('../lib/game').Game;


describe('lib/game', () => {

  it('constructor', () => {
    const game = new Game();
  });

  it('toText', () => {
    const game = new Game();
    assert.strictEqual(game.toText(), [
      ' 01234567',
      '0--------',
      '1--------',
      '2--------',
      '3---ox---',
      '4---xo---',
      '5--------',
      '6--------',
      '7--------',
      'Next: x',
      'Turn: 0',
    ].join('\n'));
  });
});
