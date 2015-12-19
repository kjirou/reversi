'use strict';

const assert = require('assert');
const lodash = require('lodash');

const consts = require('../lib/consts');
const PIECE_TYPES = consts.PIECE_TYPES;
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
      '> Place a "x" piece'
    ].join('\n'));
  });

  it('should change status by proceeding', () => {
    const game = new Game();
    assert.strictEqual(game.getHighScorer(), null);

    game._board._putPiece(3, 4, PIECE_TYPES.BLANK);
    game._board._putPiece(4, 3, PIECE_TYPES.BLANK);
    game._board._putPiece(4, 4, PIECE_TYPES.BLANK);
    game._board._putPiece(3, 1, PIECE_TYPES.WHITE);
    game._board._putPiece(3, 2, PIECE_TYPES.BLACK);
    game._board._putPiece(3, 3, PIECE_TYPES.WHITE);
    game._board._putPiece(3, 5, PIECE_TYPES.WHITE);
    assert.strictEqual(game.toText(), [
      ' 01234567',
      '0--------',
      '1--------',
      '2--------',
      '3-oxo-o--',
      '4--------',
      '5--------',
      '6--------',
      '7--------',
      'x: 1, o: 3',
      '> Place a "x" piece'
    ].join('\n'));

    let report;
    report = game.proceed(0, 0);
    assert.strictEqual(game.toText(), [
      ' 01234567',
      '0--------',
      '1--------',
      '2--------',
      '3-oxo-o--',
      '4--------',
      '5--------',
      '6--------',
      '7--------',
      'x: 1, o: 3',
      '> Place a "x" piece'
    ].join('\n'));
    assert.deepEqual(report, {
      pieceType: PIECE_TYPES.BLACK,
      rivalPieceType: PIECE_TYPES.WHITE,
      rowIndex: 0,
      colIndex: 0,
      isSuccess: false,
      isNextActorPassed: false,
    });

    report = game.proceed(3, 4);
    assert.strictEqual(game.toText(), [
      ' 01234567',
      '0--------',
      '1--------',
      '2--------',
      '3-oxxxo--',
      '4--------',
      '5--------',
      '6--------',
      '7--------',
      'x: 3, o: 2',
      '> Place a "x" piece continuously'
    ].join('\n'));
    assert.deepEqual(report, {
      pieceType: PIECE_TYPES.BLACK,
      rivalPieceType: PIECE_TYPES.WHITE,
      rowIndex: 3,
      colIndex: 4,
      isSuccess: true,
      isNextActorPassed: true,
    });

    report = game.proceed(3, 6);
    assert.strictEqual(game.toText(), [
      ' 01234567',
      '0--------',
      '1--------',
      '2--------',
      '3-oxxxxx-',
      '4--------',
      '5--------',
      '6--------',
      '7--------',
      'x: 5, o: 1',
      '> Place a "o" piece'
    ].join('\n'));
    assert.deepEqual(report, {
      pieceType: PIECE_TYPES.BLACK,
      rivalPieceType: PIECE_TYPES.WHITE,
      rowIndex: 3,
      colIndex: 6,
      isSuccess: true,
      isNextActorPassed: false,
    });
    assert.strictEqual(game._isEnded, false);
    assert.strictEqual(game.getHighScorer(), PIECE_TYPES.BLACK);

    report = game.proceed(3, 7);
    assert.strictEqual(game.toText(), [
      ' 01234567',
      '0--------',
      '1--------',
      '2--------',
      '3-ooooooo',
      '4--------',
      '5--------',
      '6--------',
      '7--------',
      'x: 0, o: 7',
      '> "o" won!'
    ].join('\n'));
    assert.deepEqual(report, {
      pieceType: PIECE_TYPES.WHITE,
      rivalPieceType: PIECE_TYPES.BLACK,
      rowIndex: 3,
      colIndex: 7,
      isSuccess: true,
      isNextActorPassed: false,
    });
    assert.strictEqual(game._isEnded, true);
    assert.strictEqual(game.getHighScorer(), PIECE_TYPES.WHITE);
  });


  describe('simulate games', () => {
    // TODO: Currently, this is running manually
    return;

    const getNextSquare = (game) => {
      const squares = game._board.getPlacableSquares(game._nextPieceType);
      if (squares.length === 0) {
        return null;
      }
      return lodash.sample(squares);
    };

    it('run games', () => {
      const gameResults = {
      };

      Array.from({ length: 1 }).forEach(() => {
        const game = new Game();
        let nextSquare;
        while (nextSquare = getNextSquare(game)) {
          game.proceed(nextSquare.rowIndex, nextSquare.colIndex);
          console.log(game.toText());
        }
      });
    });
  });
});
