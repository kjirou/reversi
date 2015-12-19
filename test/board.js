'use strict';

const assert = require('assert');

const consts = require('../lib/consts');
const PIECE_TYPES = consts.PIECE_TYPES;
const Board = require('../lib/board').Board;


describe('lib/board', () => {

  it('_createSquares', () => {
    const squares = Board.prototype._createSquares(2, 3);
    assert.strictEqual(squares.length, 2);
    assert.strictEqual(squares[0].length, 3);
    assert.strictEqual(typeof squares[0][0], 'object');
  })

  it('new', () => {
    const board = new Board();
    assert.strictEqual(board._squares.length, 8);
    assert.strictEqual(board._squares[0].length, 8);
  });

  it('toText', () => {
    const board = new Board();
    board._putPiece(0, 0, PIECE_TYPES.BLACK);
    board._putPiece(0, 1, PIECE_TYPES.WHITE);
    assert.strictEqual(board.toText(), [
      'xo------',
      '--------',
      '--------',
      '--------',
      '--------',
      '--------',
      '--------',
      '--------'
    ].join('\n'));
    assert.strictEqual(board.toText({ withRuler: true }), [
      ' 01234567',
      '0xo------',
      '1--------',
      '2--------',
      '3--------',
      '4--------',
      '5--------',
      '6--------',
      '7--------'
    ].join('\n'));
  });

  it('prepareGame', () => {
    const board = new Board();
    board.prepareGame();
    assert.strictEqual(board.toText(), [
      '--------',
      '--------',
      '--------',
      '---ox---',
      '---xo---',
      '--------',
      '--------',
      '--------'
    ].join('\n'));
  });

  it('_tryToReverseTowardOneDirection, tryToReverse, placePiece', () => {
    const board = new Board();
    board.prepareGame();
    board._putPiece(3, 2, consts.PIECE_TYPES.WHITE);
    board._putPiece(4, 0, consts.PIECE_TYPES.WHITE);
    board._putPiece(4, 1, consts.PIECE_TYPES.BLACK);
    assert.strictEqual(board.toText(), [
      '--------',
      '--------',
      '--------',
      '--oox---',
      'ox-xo---',
      '--------',
      '--------',
      '--------'
    ].join('\n'));

    assert.deepEqual(board._tryToReverseTowardOneDirection(3, 1, consts.PIECE_TYPES.BLACK, [0, 1]), [
      [3, 2],
      [3, 3]
    ]);
    assert.deepEqual(board._tryToReverseTowardOneDirection(3, 1, consts.PIECE_TYPES.WHITE, [0, 1]), []);
    assert.deepEqual(board._tryToReverseTowardOneDirection(3, 1, consts.PIECE_TYPES.BLACK, [1, 1]), []);
    assert.deepEqual(board._tryToReverseTowardOneDirection(0, 0, consts.PIECE_TYPES.BLACK, [-1, -1]), []);

    assert.deepEqual(board._tryToReverseTowardOneDirection(4, 2, consts.PIECE_TYPES.WHITE, [0, 1]), [
      [4, 3]
    ]);
    assert.deepEqual(board._tryToReverseTowardOneDirection(4, 2, consts.PIECE_TYPES.WHITE, [0, -1]), [
      [4, 1]
    ]);
    assert.deepEqual(board._tryToReverseTowardOneDirection(4, 2, consts.PIECE_TYPES.WHITE, [1, 0]), []);
    assert.deepEqual(board._tryToReverseTowardOneDirection(4, 2, consts.PIECE_TYPES.BLACK, [0, 1]), []);

    assert.deepEqual(board.tryToReverse(3, 1, consts.PIECE_TYPES.BLACK), [
      [3, 2],
      [3, 3]
    ]);
    assert.deepEqual(board.tryToReverse(4, 2, consts.PIECE_TYPES.WHITE), [
      [4, 3],
      [4, 1]
    ]);

    board.placePiece(3, 1, consts.PIECE_TYPES.BLACK);
    assert.strictEqual(board.toText(), [
      '--------',
      '--------',
      '--------',
      '-xxxx---',
      'ox-xo---',
      '--------',
      '--------',
      '--------'
    ].join('\n'));
    board.placePiece(4, 2, consts.PIECE_TYPES.WHITE);
    assert.strictEqual(board.toText(), [
      '--------',
      '--------',
      '--------',
      '-xxxx---',
      'ooooo---',
      '--------',
      '--------',
      '--------'
    ].join('\n'));
  });

  it('countByPieceType', () => {
    const board = new Board();
    board.prepareGame();
    assert.deepEqual(board.countByPieceType(), {
      BLACK: 2,
      BLANK: 60,
      WHITE: 2,
    });

    board.placePiece(3, 2, consts.PIECE_TYPES.BLACK);
    assert.deepEqual(board.countByPieceType(), {
      BLACK: 4,
      BLANK: 59,
      WHITE: 1,
    });
  });

  it('isEnded', () => {
    let board;

    board = new Board();
    board.prepareGame();
    assert.strictEqual(board.isEnded(), false);

    board = new Board();
    assert.strictEqual(board.isEnded(), true);
  });

  it('getPlacableSquares', () => {
    const board = new Board();
    assert.strictEqual(board.getPlacableSquares(consts.PIECE_TYPES.BLACK).length, 0)
    assert.strictEqual(board.getPlacableSquares(consts.PIECE_TYPES.WHITE).length, 0)

    board.prepareGame();
    assert.strictEqual(board.getPlacableSquares(consts.PIECE_TYPES.BLACK).length, 4)
    assert.strictEqual(board.getPlacableSquares(consts.PIECE_TYPES.WHITE).length, 4)
  });
});
