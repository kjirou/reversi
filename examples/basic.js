#!/usr/bin/env node

var assert = require('assert');

var reversi = require('../index');
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
game.proceed(2, 3);
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
