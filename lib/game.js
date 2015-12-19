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
    this._lastReport = null;
    this._isEnded = false;
  }

  get board() { return this._board; }
  get isEnded() { return this._isEnded; }

  proceed(rowIndex, colIndex) {
    const report = {
      pieceType: this._nextPieceType,
      rivalPieceType: Square.reversePieceType(this._nextPieceType),
      rowIndex,
      colIndex,
      isSuccess: false,
      isNextActorPassed: false,
    };

    const isSuccess = this._board.isPlacableSquare(rowIndex, colIndex, report.pieceType);

    if (isSuccess) {
      report.isSuccess = true;
      this._board.placePiece(rowIndex, colIndex, report.pieceType);
      this._nextPieceType = report.rivalPieceType;

      const nextPieceType = this._nextPieceType;
      const nextRivalPieceType = Square.reversePieceType(nextPieceType);
      if (!this._board.hasPlacableSquare(nextPieceType)) {
        if (this._board.hasPlacableSquare(nextRivalPieceType)) {
          this._nextPieceType = nextRivalPieceType;
          report.isNextActorPassed = true;
        } else {
          this._isEnded = true;
        }
      }
    }

    this._lastReport = report;

    return report;
  }

  /*
   * @return {string|null} - One of PIECE_TYPES or null(=draw)
   */
  getHighScorer() {
    const pieceTypeCounts = this._board.countByPieceType();
    let highScorer = null;
    if (pieceTypeCounts[PIECE_TYPES.BLACK] > pieceTypeCounts[PIECE_TYPES.WHITE]) {
      highScorer = PIECE_TYPES.BLACK;
    } else if (pieceTypeCounts[PIECE_TYPES.WHITE] > pieceTypeCounts[PIECE_TYPES.BLACK]) {
      highScorer = PIECE_TYPES.WHITE;
    }
    return highScorer;
  }

  toText() {
    const pieceTypeCounts = this._board.countByPieceType();

    const lines = [];
    lines.push(this._board.toText({ withRuler: true }));

    let score = '';
    score += `${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.BLACK]}: ${pieceTypeCounts[PIECE_TYPES.BLACK]}, `;
    score += `${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.WHITE]}: ${pieceTypeCounts[PIECE_TYPES.WHITE]}`;
    lines.push(score);

    let message = '> ';
    if (this._isEnded) {
      message += {
        [PIECE_TYPES.BLACK]: `"${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.BLACK]}" won!`,
        [PIECE_TYPES.WHITE]: `"${PIECE_TYPE_SYMBOL_TEXTS[PIECE_TYPES.WHITE]}" won!`,
        '': 'Draw',
      }[this.getHighScorer() || ''];
    } else {
      message += `Place a "${PIECE_TYPE_SYMBOL_TEXTS[this._nextPieceType]}" piece`;
      if (this._lastReport && this._lastReport.isNextActorPassed) {
        message += ' continuously';
      }
    }
    lines.push(message);

    return lines.join('\n');
  }
}


module.exports = {
  Game,
};
