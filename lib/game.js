'use strict';

const Board = require('./board').Board;
const consts = require('./consts');


class Game {

  constructor() {
    this._board = new Board();
    this._board.prepareGame();
    this._turnCount = 0;
    this._nextPieceType = consts.PIECE_TYPES.BLACK;
  }

  proceed(rowIndex, colIndex) {
    const reversibleSquareIndexes = this._board.tryToReverse(rowIndex, colIndex, this._nextPieceType);
    let isSuccess = reversibleSquareIndexes.length > 0;

    if (isSuccess) {
      this._board.putPieceToReverse(rowIndex, colIndex, this._nextPieceType);
      this._turnCount += 1;
      if (this._nextPieceType === consts.PIECE_TYPES.BLACK) {
        this._nextPieceType = consts.PIECE_TYPES.WHITE;
      } else {
        this._nextPieceType = consts.PIECE_TYPES.BLACK;
      }
    }

    return {
      isSuccess,
    };
  }

  toText() {
    let text = ' 01234567\n';
    text += this._board.toText()
      .split('\n')
      .map((line, rowIndex) => String(rowIndex) + line)
      .join('\n')
    ;
    text += '\n';
    text += `Next: ${consts.PIECE_TYPE_SYMBOL_TEXTS[this._nextPieceType]}\n`;
    text += `Turn: ${this._turnCount}`
    return text;
  }
}

module.exports = {
  Game,
};
