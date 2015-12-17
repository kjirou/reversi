var Board = require('./board');


function Game() {
  this._board = new Board();
  this._board.initializeGame();
  this._turnCount = 0;
  this._nextPieceType = Board.PIECE_TYPES.BLACK;
}

Game.prototype.proceed = function proceed(rowIndex, colIndex) {
  var reversibleSquareIndexes = this._board.tryToReverse(rowIndex, colIndex, this._nextPieceType);
  var isSuccess = reversibleSquareIndexes.length > 0;

  if (isSuccess) {
    this._board.putPieceToReverse(rowIndex, colIndex, this._nextPieceType);
    this._turnCount += 1;
    if (this._nextPieceType === Board.PIECE_TYPES.BLACK) {
      this._nextPieceType = Board.PIECE_TYPES.WHITE;
    } else {
      this._nextPieceType = Board.PIECE_TYPES.BLACK;
    }
  }

  var result = {
    isSuccess: isSuccess
  };
};

Game.prototype.toText = function toText() {
};

module.exports = Game;
