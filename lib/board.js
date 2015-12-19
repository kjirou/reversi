'use strict';

const assert = require('assert');
const countBy = require('lodash.countby');
const flatten = require('lodash.flatten');

const consts = require('./consts');
const PIECE_TYPES = consts.PIECE_TYPES;
const PIECE_TYPE_SYMBOL_TEXTS = consts.PIECE_TYPE_SYMBOL_TEXTS;

const MAX_ROW_COUNT = 8;
const MAX_COL_COUNT = 8;
const DIRECTIONS = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1]
];


class Square {

  constructor(rowIndex, colIndex) {
    this._pieceType = PIECE_TYPES.BLANK;
    this._rowIndex = rowIndex;
    this._colIndex = colIndex;
  }

  get pieceType() { return this._pieceType }
  set pieceType(value) { this._pieceType = value; }
  get rowIndex() { return this._rowIndex }
  get colIndex() { return this._colIndex }
}

class Board {

  constructor() {
    this._squares = this._createSquares(MAX_ROW_COUNT, MAX_COL_COUNT);
  }

  _createSquares(maxRowCount, maxColCount) {
    const squares = [];
    let rowSquares;
    for (let rowIndex = 0; rowIndex < maxRowCount; rowIndex += 1) {
      rowSquares = [];
      for (let colIndex = 0; colIndex < maxColCount; colIndex += 1) {
        let square = new Square(rowIndex, colIndex);
        rowSquares.push(square);
      }
      squares.push(rowSquares);
    }
    return squares;
  }

  _getSquare(rowIndex, colIndex) {
    if (this._squares[rowIndex] === undefined) {
      return null;
    };
    return this._squares[rowIndex][colIndex] || null;
  }

  _ensureSquare(rowIndex, colIndex) {
    const square = this._getSquare(rowIndex, colIndex);
    if (!square) {
      throw new Error('Can not find the square by [' + rowIndex + '][' + colIndex + ']');
    }
    return square;
  }

  _putPiece(rowIndex, colIndex, pieceType) {
    this._ensureSquare(rowIndex, colIndex).pieceType = pieceType;
  }

  prepareGame() {
    this._putPiece(3, 3, PIECE_TYPES.WHITE);
    this._putPiece(3, 4, PIECE_TYPES.BLACK);
    this._putPiece(4, 3, PIECE_TYPES.BLACK);
    this._putPiece(4, 4, PIECE_TYPES.WHITE);
  }

  _tryToReverseTowardOneDirection(rowIndex, colIndex, presentedPieceType, direction) {
    let isSuccess = false;
    const reversibleSquares = [];

    const nextStep = (rowIndex, colIndex, presentedPieceType, direction) => {
      const nextSquare = this._getSquare(rowIndex, colIndex);
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
  }

  tryToReverse(rowIndex, colIndex, presentedPieceType) {
    let reversibleSquares = [];
    DIRECTIONS.forEach(direction => {
      reversibleSquares = reversibleSquares.concat(
        this._tryToReverseTowardOneDirection(rowIndex, colIndex, presentedPieceType, direction)
      );
    });
    return reversibleSquares;
  }

  isPlacableSquare(rowIndex, colIndex, pieceType) {
    const square = this._ensureSquare(rowIndex, colIndex);
    if (square.pieceType !== PIECE_TYPES.BLANK) {
      return false;
    }
    return this.tryToReverse(rowIndex, colIndex, pieceType).length > 0;
  }

  _reversePieces(squareIndexes) {
    squareIndexes.forEach(squareIndex => {
      const square = this._ensureSquare(squareIndex[0], squareIndex[1]);
      if (square.pieceType === PIECE_TYPES.BLACK) {
        square.pieceType = PIECE_TYPES.WHITE;
      } else if (square.pieceType === PIECE_TYPES.WHITE) {
        square.pieceType = PIECE_TYPES.BLACK;
      }
    });
  }

  placePiece(rowIndex, colIndex, pieceType) {
    assert(pieceType in PIECE_TYPES);
    const squareIndexes = this.tryToReverse(rowIndex, colIndex, pieceType);
    assert.notStrictEqual(squareIndexes.length, 0, 'Can not put a piece into the square');
    this._putPiece(rowIndex, colIndex, pieceType);
    this._reversePieces(squareIndexes);
  }

  countByPieceType() {
    return countBy(flatten(this._squares), square => square.pieceType);
  }

  getPlacableSquares(pieceType) {
    return flatten(this._squares)
      .filter(square => this.isPlacableSquare(square.rowIndex, square.colIndex, pieceType))
    ;
  }

  isEnded() {
    return !flatten(this._squares).some(square => {
      return (
        this.isPlacableSquare(square.rowIndex, square.colIndex, PIECE_TYPES.BLACK) ||
        this.isPlacableSquare(square.rowIndex, square.colIndex, PIECE_TYPES.WHITE)
      );
    });
  }

  toText(options) {
    options = Object.assign({
      withRuler: false,
    }, options || {});

    let text = this._squares.map(rowSquares => {
      return rowSquares.map(square => {
        return PIECE_TYPE_SYMBOL_TEXTS[square.pieceType];
      }).join('');
    }).join('\n');

    if (options.withRuler) {
      text = text
        .split('\n')
        .map((line, rowIndex) => String(rowIndex) + line)
        .join('\n')
      ;
      let header = ' ' + this._squares[0].map(square => String(square.colIndex)).join('');
      text = [header, text].join('\n');
    }

    return text;
  }
}


module.exports = {
  Board,
};
