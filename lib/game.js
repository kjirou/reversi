'use strict';

const Board = require('./board').Board;


class Game {

  constructor() {
    this._board = new Board();
    this._board.prepareGame();
    this._turnCount = 0;
    this._nextPieceType = Board.PIECE_TYPES.BLACK;
  }

  proceed(rowIndex, colIndex) {
    const reversibleSquareIndexes = this._board.tryToReverse(rowIndex, colIndex, this._nextPieceType);
    let isSuccess = reversibleSquareIndexes.length > 0;

    if (isSuccess) {
      this._board.putPieceToReverse(rowIndex, colIndex, this._nextPieceType);
      this._turnCount += 1;
      if (this._nextPieceType === Board.PIECE_TYPES.BLACK) {
        this._nextPieceType = Board.PIECE_TYPES.WHITE;
      } else {
        this._nextPieceType = Board.PIECE_TYPES.BLACK;
      }
    }

    return {
      isSuccess,
    };
  }

  toText() {
  }
}

module.exports = {
  Game,
};
