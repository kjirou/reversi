# reversi

[![npm version](https://badge.fury.io/js/reversi.svg)](http://badge.fury.io/js/reversi)
[![Build Status](https://travis-ci.org/kjirou/reversi.svg?branch=master)](https://travis-ci.org/kjirou/reversi)

Core logics for the [Reversi](https://en.wikipedia.org/wiki/Reversi)

![](https://raw.githubusercontent.com/kjirou/reversi/master/doc/demo.gif)


## Playtest

### Installation

```bash
npm install -g reversi
```

### Run by CUI

You can start the Reversi game by `reversi` command:

```bash
$reversi

 01234567
0--------
1--------
2--------
3---ox---
4---xo---
5--------
6--------
7--------
x: 2, o: 2
> Place a "x" piece
(x,y):
```

If you input like this:

```
(x,y):3,2
```

It becomes such a result:

```
 01234567
0--------
1--------
2---x----
3---xx---
4---xo---
5--------
6--------
7--------
x: 4, o: 1
> Place a "o" piece
(x,y):
```


## Use in Node.js

### Installation

```bash
npm install --save reversi
```

### Example

```js
var reversi = require('reversi');
var Game = reversi.Game;
var PIECE_TYPES = reversi.PIECE_TYPES;


//
// Start a game
//
var game = new Game();
console.log(game.toText());
//
//  01234567
// 0--------
// 1--------
// 2--------
// 3---ox---
// 4---xo---
// 5--------
// 6--------
// 7--------
// x: 2, o: 2
// > Place a "x" piece
//


//
// Place a piece by (rowIndex, colIndex)
//
var report = game.proceed(2, 3);
console.log(game.toText());
//
//  01234567
// 0--------
// 1--------
// 2---x----
// 3---xx---
// 4---xo---
// 5--------
// 6--------
// 7--------
// x: 4, o: 1
// > Place a "o" piece
//


//
// Get more information at "proceed" execution
//
console.log(report);
//
// { pieceType: 'BLACK',
//   rivalPieceType: 'WHITE',
//   rowIndex: 2,
//   colIndex: 3,
//   isSuccess: true,
//   isNextActorPassed: false }
//


//
// Get status
//
game.isEnded;          // -> false
game.getHighScorer();  // -> PIECE_TYPES.BLACK


//
// Board object
//
var board = game.board;
var squares = board.squares;  // -> squares[rowIndex][colIndex]


//
// Chack placable squares
//
board.isPlacableSquare(0, 0, PIECE_TYPES.WHITE);  // -> false
board.isPlacableSquare(4, 5, PIECE_TYPES.WHITE);  // -> true
board.getPlacableSquares(PIECE_TYPES.WHITE);      // -> 3 squares
board.hasPlacableSquare(PIECE_TYPES.WHITE);       // -> true


//
// Get score detail
//
board.countByPieceType();  // -> { [PIECE_TYPES.BLACK]: 4, [PIECE_TYPES.WHITE]: 1, [PIECE_TYPES.BLANK]: 59 }
```
