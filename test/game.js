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
      'x: 2, o: 2',
      '> Put a "x" piece'
    ].join('\n'));
  });

  it('proceed', () => {
    const game = new Game();

    assert.strictEqual(game.proceed(3, 2).isSuccess, true);
    assert.strictEqual(game.toText(), [
      ' 01234567',
      '0--------',
      '1--------',
      '2--------',
      '3--xxx---',
      '4---xo---',
      '5--------',
      '6--------',
      '7--------',
      'x: 4, o: 1',
      '> Put a "o" piece'
    ].join('\n'));

    assert.strictEqual(game.proceed(2, 4).isSuccess, true);
    assert.strictEqual(game.toText(), [
      ' 01234567',
      '0--------',
      '1--------',
      '2----o---',
      '3--xxo---',
      '4---xo---',
      '5--------',
      '6--------',
      '7--------',
      'x: 3, o: 3',
      '> Put a "x" piece'
    ].join('\n'));

    assert.strictEqual(game.proceed(5, 5).isSuccess, true);
    assert.strictEqual(game.toText(), [
      ' 01234567',
      '0--------',
      '1--------',
      '2----o---',
      '3--xxo---',
      '4---xx---',
      '5-----x--',
      '6--------',
      '7--------',
      'x: 5, o: 2',
      '> Put a "o" piece'
    ].join('\n'));

    assert.strictEqual(game.proceed(1, 4).isSuccess, false);
    assert.strictEqual(game.toText(), [
      ' 01234567',
      '0--------',
      '1--------',
      '2----o---',
      '3--xxo---',
      '4---xx---',
      '5-----x--',
      '6--------',
      '7--------',
      'x: 5, o: 2',
      '> Put a "o" piece'
    ].join('\n'));
  });
});
