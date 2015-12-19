var assert = require('assert');

var Board = require('../lib/board');


describe('lib/board', function() {

  it('_createSquares', function() {
    var squares = Board.prototype._createSquares(2, 3);
    assert.strictEqual(squares.length, 2);
    assert.strictEqual(squares[0].length, 3);
    assert.strictEqual(typeof squares[0][0], 'object');
  })

  it('new', function() {
    var board = new Board();
    assert.strictEqual(board._squares.length, 8);
    assert.strictEqual(board._squares[0].length, 8);
  });

  it('prepareGame', function() {
    var board = new Board();
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

  it('_tryToReverseTowardOneDirection, tryToReverse, putPieceToReverse', function() {
    var board = new Board();
    board.prepareGame();
    board._putPiece(3, 2, Board.PIECE_TYPES.WHITE);
    board._putPiece(4, 0, Board.PIECE_TYPES.WHITE);
    board._putPiece(4, 1, Board.PIECE_TYPES.BLACK);
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

    assert.deepEqual(board._tryToReverseTowardOneDirection(3, 1, Board.PIECE_TYPES.BLACK, [0, 1]), [
      [3, 2],
      [3, 3]
    ]);
    assert.deepEqual(board._tryToReverseTowardOneDirection(3, 1, Board.PIECE_TYPES.WHITE, [0, 1]), []);
    assert.deepEqual(board._tryToReverseTowardOneDirection(3, 1, Board.PIECE_TYPES.BLACK, [1, 1]), []);

    assert.deepEqual(board._tryToReverseTowardOneDirection(4, 2, Board.PIECE_TYPES.WHITE, [0, 1]), [
      [4, 3]
    ]);
    assert.deepEqual(board._tryToReverseTowardOneDirection(4, 2, Board.PIECE_TYPES.WHITE, [0, -1]), [
      [4, 1]
    ]);
    assert.deepEqual(board._tryToReverseTowardOneDirection(4, 2, Board.PIECE_TYPES.WHITE, [1, 0]), []);
    assert.deepEqual(board._tryToReverseTowardOneDirection(4, 2, Board.PIECE_TYPES.BLACK, [0, 1]), []);

    assert.deepEqual(board.tryToReverse(3, 1, Board.PIECE_TYPES.BLACK), [
      [3, 2],
      [3, 3]
    ]);
    assert.deepEqual(board.tryToReverse(4, 2, Board.PIECE_TYPES.WHITE), [
      [4, 3],
      [4, 1]
    ]);

    board.putPieceToReverse(3, 1, Board.PIECE_TYPES.BLACK);
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
    board.putPieceToReverse(4, 2, Board.PIECE_TYPES.WHITE);
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
});
