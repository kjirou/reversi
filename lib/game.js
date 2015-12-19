'use strict';

const board = require('./board');
const Board = board.Board;
const Square = board.Square;
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

    let isSuccess = this._board.isPlacableSquare(rowIndex, colIndex, this._nextPieceType);

    if (isSuccess) {
      this._board.placePiece(rowIndex, colIndex, this._nextPieceType);
      this._nextPieceType = Square.reversePieceType(this._nextPieceType);
    }

    this._isEnded = this._board.isEnded();

    return Object.assign(result, {
      isSuccess,
    });
  }

  toText() {
    const pieceTypeCounts = this._board.countByPieceType();

    let text = this._board.toText({ withRuler: true });

    let score = '';
    score += `${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.BLACK]}: ${pieceTypeCounts[PIECE_TYPES.BLACK]}, `;
    score += `${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.WHITE]}: ${pieceTypeCounts[PIECE_TYPES.WHITE]}`;
    text = [text, score].join('\n');

    let message = '> ';
    if (this._isEnded) {
      if (pieceTypeCounts[PIECE_TYPES.BLACK] > pieceTypeCounts[PIECE_TYPES.WHITE]) {
        message += `"${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.BLACK]}" won!`;
      } else if (pieceTypeCounts[PIECE_TYPES.WHITE] > pieceTypeCounts[PIECE_TYPES.BLACK]) {
        message += `"${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.WHITE]}" won!`;
      } else {
        message += 'Draw';
      }
    } else {
      message += `Put a "${PIECE_TYPE_SYMBOL_TEXTS[this._nextPieceType]}" piece`;
    }
    text = [text, message].join('\n');

    return text;
  }
}


module.exports = {
  Game,
};
