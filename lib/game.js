var Board = require('./board');


function Game() {
  this._board = new Board();
  this._board.initializeGame();
  this._turnCount = 0;
  this._nextPieceType = Board.PIECE_TYPES.BLACK;
}

Game.prototype.proceed = function proceed(rowIndex, colIndex) {
  var result = {
  };
};

Game.prototype.toText = function toText() {
};

module.exports = Game;
