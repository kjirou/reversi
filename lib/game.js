'use strict';

const Board = require('./board').Board;
const consts = require('./consts');
const PIECE_TYPES = consts.PIECE_TYPES;
const PIECE_TYPE_SYMBOL_TEXTS = consts.PIECE_TYPE_SYMBOL_TEXTS;


class Game {

  constructor() {
    this._board = new Board();
    this._board.prepareGame();
    this._nextPieceType = PIECE_TYPES.BLACK;
    this._isEnded = false;
  }

  proceed(rowIndex, colIndex) {
    const result = {
      isSuccess: false,
    };

    if (this._isEnded) {
      return result;
    }

    const reversibleSquareIndexes = this._board.tryToReverse(rowIndex, colIndex, this._nextPieceType);
    let isSuccess = reversibleSquareIndexes.length > 0;

    if (isSuccess) {
      this._board.putPieceToReverse(rowIndex, colIndex, this._nextPieceType);
      if (this._nextPieceType === PIECE_TYPES.BLACK) {
        this._nextPieceType = PIECE_TYPES.WHITE;
      } else {
        this._nextPieceType = PIECE_TYPES.BLACK;
      }
    }

    this._isEnded = this._board.isEnded();

    return Object.assign(result, {
      isSuccess,
    });
  }

  toText() {
    const pieceTypeCounts = this._board.countPieceTypes();

    let message = '> ';
    if (this._isEnded) {
      if (pieceTypeCounts[PIECE_TYPES.BLACK] > pieceTypeCounts[PIECE_TYPES.WHITE]) {
        message += `"${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.BLACK]}" won!`;
      } else if (pieceTypeCounts[PIECE_TYPES.WHITE] > pieceTypeCounts[PIECE_TYPES.BLACK]) {
        message += `"${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.WHITE]}" won!`;
      } else {
        message += 'Draw..';
      }
    } else {
      message += `Put a "${PIECE_TYPE_SYMBOL_TEXTS[this._nextPieceType]}" piece`;
    }

    let text = ' 01234567\n';
    text += this._board.toText()
      .split('\n')
      .map((line, rowIndex) => String(rowIndex) + line)
      .join('\n')
    ;
    text += '\n';
    text += `${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.BLACK]}: ${pieceTypeCounts[PIECE_TYPES.BLACK]}, `;
    text += `${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.WHITE]}: ${pieceTypeCounts[PIECE_TYPES.WHITE]}\n`;
    text += message;

    return text;
  }
}

module.exports = {
  Game,
};
