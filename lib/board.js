var assert = require('assert');


var MAX_ROW_COUNT = 8;
var MAX_COL_COUNT = 8;
var PIECE_TYPES = {
  BLACK: 'BLACK',
  BLANK: 'BLANK',
  WHITE: 'WHITE'
};
var DIRECTIONS = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1]
];


function Board() {
  this._squares = this._createSquares(MAX_ROW_COUNT, MAX_COL_COUNT);
}

Board.prototype._createSquares = function _createSquares(maxRowCount, maxColCount) {
  var squares = [];
  var rowSquares;
  for (var rowIndex = 0; rowIndex < maxRowCount; rowIndex += 1) {
    rowSquares = [];
    for (var colIndex = 0; colIndex < maxColCount; colIndex += 1) {
      rowSquares.push({
        rowIndex: rowIndex,
        colIndex: colIndex,
        pieceType: PIECE_TYPES.BLANK
      });
    }
    squares.push(rowSquares);
  }
  return squares;
};

Board.prototype._getSquare = function _getSquare(rowIndex, colIndex) {
  return this._squares[rowIndex][colIndex] || null;
};

Board.prototype._ensureSquare = function _ensureSquare(rowIndex, colIndex) {
  var square = this._getSquare(rowIndex, colIndex);
  if (!square) {
    throw new Error('Can not find the square by [' + rowIndex + '][' + colIndex + ']');
  }
  return square;
};

Board.prototype._putPiece = function(rowIndex, colIndex, pieceType) {
  this._ensureSquare(rowIndex, colIndex).pieceType = pieceType;
};

Board.prototype.initializeGame = function() {
  this._putPiece(3, 3, PIECE_TYPES.WHITE);
  this._putPiece(3, 4, PIECE_TYPES.BLACK);
  this._putPiece(4, 3, PIECE_TYPES.BLACK);
  this._putPiece(4, 4, PIECE_TYPES.WHITE);
};

Board.prototype._tryToReverseTowardOneDirection = function(rowIndex, colIndex, presentedPieceType, direction) {
  var that = this;
  var isSuccess = false;
  var reversibleSquares = [];

  function nextStep(rowIndex, colIndex, presentedPieceType, direction) {
    var nextSquare = that._getSquare(rowIndex, colIndex);
    if (
      nextSquare &&
      nextSquare.pieceType !== PIECE_TYPES.BLANK
    ) {
      if (nextSquare.pieceType !== presentedPieceType) {
        reversibleSquares.push([rowIndex, colIndex]);
        nextStep(rowIndex + direction[0], colIndex + direction[1], presentedPieceType, direction);
      } else if (nextSquare.pieceType === presentedPieceType && reversibleSquares.length > 0) {
        isSuccess = true;
      }
    }
  };
  nextStep(rowIndex + direction[0], colIndex + direction[1], presentedPieceType, direction);

  return isSuccess ? reversibleSquares : [];
};

Board.prototype.tryToReverse = function(rowIndex, colIndex, presentedPieceType) {
  var that = this;
  var reversibleSquares = [];
  DIRECTIONS.forEach(function(direction) {
    reversibleSquares = reversibleSquares.concat(
      that._tryToReverseTowardOneDirection(rowIndex, colIndex, presentedPieceType, direction)
    );
  });
  return reversibleSquares;
};

Board.prototype._reversePieces = function _reversePieces(squareIndexes) {
  var that = this;
  squareIndexes.forEach(function(squareIndex) {
    var square = that._ensureSquare(squareIndex[0], squareIndex[1]);
    if (square.pieceType === PIECE_TYPES.BLACK) {
      square.pieceType = PIECE_TYPES.WHITE;
    } else if (square.pieceType === PIECE_TYPES.WHITE) {
      square.pieceType = PIECE_TYPES.BLACK;
    }
  });
};

Board.prototype.putPieceToReverse = function putPieceToReverse(rowIndex, colIndex, pieceType) {
  assert(pieceType in PIECE_TYPES);
  var squareIndexes = this.tryToReverse(rowIndex, colIndex, pieceType);
  assert.notStrictEqual(squareIndexes.length, 0);
  this._putPiece(rowIndex, colIndex, pieceType);
  this._reversePieces(squareIndexes);
};

Board.prototype.toText = function() {
  return this._squares.map(function(rowSquares) {
    return rowSquares.map(function(square) {
      var pieceText = '-';
      if (square.pieceType === PIECE_TYPES.WHITE) {
        pieceText = 'o';
      } else if (square.pieceType === PIECE_TYPES.BLACK) {
        pieceText = 'x';
      }
      return pieceText;
    }).join('');
  }).join('\n');
};

Object.assign(Board, {
  PIECE_TYPES: PIECE_TYPES
});


module.exports = Board;
