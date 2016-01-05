'use strict';

const assert = require('assert');

const consts = require('../lib/consts');
const PIECE_TYPES = consts.PIECE_TYPES;
const Board = require('../lib/board').Board;
const Square = require('../lib/square').Square;


describe('lib/board', () => {

  const STANDARD_MAP_TEXT = [
    '--------',
    '--------',
    '--------',
    '---ox---',
    '---xo---',
    '--------',
    '--------',
    '--------',
  ].join('\n');


  it('_createSquares', () => {
    const squares = Board._createSquares(2, 3);
    assert.strictEqual(squares.length, 2);
    assert.strictEqual(squares[0].length, 3);
    assert.strictEqual(typeof squares[0][0], 'object');
  })

  it('_createSquaresFromMapText', () => {
    let squares;

    squares = Board._createSquaresFromMapText('-xo');
    assert.strictEqual(squares.length, 1)
    assert.strictEqual(squares[0].length, 3)
    assert(squares[0][0] instanceof Square);
    assert.strictEqual(squares[0][0].pieceType, PIECE_TYPES.BLANK)
    assert.strictEqual(squares[0][1].pieceType, PIECE_TYPES.BLACK)
    assert.strictEqual(squares[0][2].pieceType, PIECE_TYPES.WHITE)

    squares = Board._createSquaresFromMapText([
      '---',
      '---',
    ].join('\n'));
    assert.strictEqual(squares.length, 2)

    assert.throws(() => {
      Board._createSquaresFromMapText('--\n---');
    }, /rect/);
  })

  it('constructor', () => {
    const board = new Board();
    assert.strictEqual(board._squares.length, 8);
    assert.strictEqual(board._squares[0].length, 8);
  });

  it('accessors', () => {
    const board = new Board();
    assert(Array.isArray(board.squares));
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
    const board = new Board({ mapText: STANDARD_MAP_TEXT });
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
    const board = new Board({ mapText: STANDARD_MAP_TEXT });
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
      [ [3, 2], [3, 3] ],
      [
        [],
        [],
        [ [3, 2], [3, 3] ],
        [],
        [],
        [],
        [],
        [],
      ]
    ]);
    assert.deepEqual(board.tryToReverse(4, 2, consts.PIECE_TYPES.WHITE), [
      [ [4, 3], [4, 1] ],
      [
        [],
        [],
        [ [4, 3] ],
        [],
        [],
        [],
        [ [4, 1] ],
        [],
      ]
    ]);

    const squareIndexes = board.placePiece(3, 1, consts.PIECE_TYPES.BLACK);
    assert.strictEqual(squareIndexes.length, 2);
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
    const board = new Board({ mapText: STANDARD_MAP_TEXT });
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

  it('getPlaceableSquares', () => {
    let board;

    board = new Board();
    assert.strictEqual(board.getPlaceableSquares(consts.PIECE_TYPES.BLACK).length, 0)
    assert.strictEqual(board.getPlaceableSquares(consts.PIECE_TYPES.WHITE).length, 0)

    board = new Board({ mapText: STANDARD_MAP_TEXT });
    assert.strictEqual(board.getPlaceableSquares(consts.PIECE_TYPES.BLACK).length, 4)
    assert.strictEqual(board.getPlaceableSquares(consts.PIECE_TYPES.WHITE).length, 4)
  });

  it('can create different size board', () => {
    const board = new Board({ rowCount: 4, colCount: 6 });
    assert.strictEqual(board.toText(), [
      '------',
      '------',
      '------',
      '------',
    ].join('\n'));
  });

  it('can create a board from map-text', () => {
    const board = new Board({ mapText: 'ox-\nxo-' });
    assert.strictEqual(board.toText(), [
      'ox-',
      'xo-',
    ].join('\n'));
  });
});
