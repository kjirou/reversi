function Board() {

  this._squares = [];

  for (var rowIndex = 0; rowIndex < 8; rowIndex += 1) {
    var squaresOfRow = [];
    for (var colIndex = 0; colIndex < 8; colIndex += 1) {
      (function(rowIndex, colIndex) {
        squaresOfRow.push({
          rowIndex: rowIndex,
          colIndex: colIndex,
          komaType: null  // or 'white', 'black'
        });
      })(rowIndex, colIndex);
    }
    this._squares.push(squaresOfRow);
  }

  this.putKoma(3, 3, 'white');
  this.putKoma(3, 4, 'black');
  this.putKoma(4, 4, 'white');
  this.putKoma(4, 3, 'black');
}

Board.prototype.putKoma = function(rowIndex, colIndex, komaType) {
  this._squares[rowIndex][colIndex].komaType = komaType;
};

Board.prototype.tryReverse = function(rowIndex, colIndex, fromKomaType) {
  var that = this;
  var directions = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1]
  ];
  var reversibleSquares = [];
  directions.forEach(function(direction) {
    reversibleSquares = reversibleSquares.concat(
      that.tryReverseToDirection(rowIndex, colIndex, fromKomaType, direction)
    );
  });
  return reversibleSquares;
};

Board.prototype.tryReverseToDirection = function(rowIndex, colIndex, fromKomaType, direction) {
  var that = this;
  var isSuccess = false;
  var reversibleSquares = [];

  function nextStep(rowIndex, colIndex, fromKomaType, direction) {
    var nextSquare = that._squares[rowIndex][colIndex];
    if (
      nextSquare &&
      nextSquare.komaType !== null
    ) {
      if (nextSquare.komaType !== fromKomaType) {
        reversibleSquares.push([rowIndex, colIndex]);
        nextStep(rowIndex + direction[0], colIndex + direction[1], fromKomaType, direction);
      } else if (nextSquare.komaType === fromKomaType && reversibleSquares.length > 0) {
        isSuccess = true;
      }
    }
  };
  nextStep(rowIndex + direction[0], colIndex + direction[1], fromKomaType, direction);

  return isSuccess ? reversibleSquares : [];
};

Board.prototype.canReverseOthers = function(rowIndex, colIndex, komaType) {
};

Board.prototype.toText = function() {
  return this._squares.map(function(squaresOfRow) {
    return squaresOfRow.map(function(square) {
      var komaText = ' ';
      if (square.komaType === 'white') {
        komaText = 'o';
      } else if (square.komaType === 'black') {
        komaText = 'x';
      }
      return komaText;
    }).join('');
  }).join('\n');
};


var board = new Board();

//console.log(board.toText());

var result = board.tryReverse(2, 3, 'black');
console.log(result);
