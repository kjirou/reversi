'use strict';

const assert = require('assert');
const countBy = require('lodash.countby');
const flatten = require('lodash.flatten');
const uniq = require('lodash.uniq');

const consts = require('./consts');
const DIRECTIONS = consts.DIRECTIONS;
const DIRECTION_NAMES = consts.DIRECTION_NAMES;
const PIECE_TYPES = consts.PIECE_TYPES;
const PIECE_TYPE_SYMBOL_TEXTS = consts.PIECE_TYPE_SYMBOL_TEXTS;
const Square = require('./square').Square;


class Board {

  constructor(options) {
    options = Object.assign({
      mapText: null,
      rowCount: 8,
      colCount: 8,
    }, options || {});

    if (options.mapText) {
      this._squares = Board._createSquaresFromMapText(options.mapText);
    } else {
      this._squares = Board._createSquares(options.rowCount, options.colCount);
    }
  }

  get squares() { return this._squares; }

  static _createSquares(maxRowCount, maxColCount) {
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

  static _createSquaresFromMapText(mapText) {

    // Normalize the text
    mapText = mapText.replace(/(?:\r\n|\r)/g, '\n');
    mapText = mapText.replace(/\n+$/g, '');

    const squares = [];
    mapText.split('\n')
      .forEach((rowText, rowIndex) => {
        const rowSquares = [];
        rowText.split('')
          .forEach((ch, colIndex) => {
            const square = new Square(rowIndex, colIndex);
            square.setPieceTypeBySymbolText(ch);
            rowSquares.push(square);
          })
        ;
        squares.push(rowSquares);
      })
    ;

    assert(uniq(squares.map(rowSquares => rowSquares.length)).length <= 1, 'Map-text is not a rect');

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

  /*
   * @return {Array} - Indexes of reversible squares
   *                   e.g.
   *                     [
   *                       [ [1, 0], [2, 0], [0, 1] ],  // Joined
   *                       [
   *                         [[1, 0], [2, 0]],  // UP
   *                         [],                // UP_RIGHT
   *                         [[0, 1]],          // RIGHT
   *                         [],                // DOWN_RIGHT
   *                         [],                // DOWN
   *                         [],                // DOWN_LEFT
   *                         [],                // LEFT
   *                         [],                // UP_LEFT
   *                       ]
   *                     ]
   */
  tryToReverse(rowIndex, colIndex, presentedPieceType) {
    const reversiblePositionsEachDirection = [];
    DIRECTIONS.forEach(direction => {
      reversiblePositionsEachDirection.push(
        this._tryToReverseTowardOneDirection(rowIndex, colIndex, presentedPieceType, direction)
      );
    });
    return [
      flatten(reversiblePositionsEachDirection),
      reversiblePositionsEachDirection,
    ];
  }

  isPlaceableSquare(rowIndex, colIndex, pieceType) {
    const square = this._ensureSquare(rowIndex, colIndex);
    if (square.pieceType !== PIECE_TYPES.BLANK) {
      return false;
    }
    return this.tryToReverse(rowIndex, colIndex, pieceType)[0].length > 0;
  }

  placePiece(rowIndex, colIndex, pieceType) {
    assert(pieceType in PIECE_TYPES);
    const reversiblePositionMap = this.tryToReverse(rowIndex, colIndex, pieceType);
    assert.notStrictEqual(reversiblePositionMap[0].length, 0, 'Can not put a piece into the square');
    this._putPiece(rowIndex, colIndex, pieceType);
    reversiblePositionMap[0].forEach(position => this._ensureSquare(position[0], position[1]).reverse());
    return reversiblePositionMap;
  }

  countByPieceType() {
    return Object.assign(
      {
        [PIECE_TYPES.BLACK]: 0,
        [PIECE_TYPES.BLANK]: 0,
        [PIECE_TYPES.WHITE]: 0,
      },
      countBy(flatten(this._squares), square => square.pieceType)
    );
  }

  getPlaceableSquares(pieceType) {
    return flatten(this._squares)
      .filter(square => this.isPlaceableSquare(square.rowIndex, square.colIndex, pieceType))
    ;
  }

  hasPlacableSquare(pieceType) {
    return this.getPlaceableSquares(pieceType).length > 0
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
  Square,
};
