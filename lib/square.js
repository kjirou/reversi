'use strict';

const assert = require('assert');
const values = require('lodash.values');

const consts = require('./consts');
const PIECE_TYPES = consts.PIECE_TYPES;
const PIECE_TYPE_SYMBOL_TEXTS = consts.PIECE_TYPE_SYMBOL_TEXTS;


class Square {

  constructor(rowIndex, colIndex) {
    this._pieceType = PIECE_TYPES.BLANK;
    this._rowIndex = rowIndex;
    this._colIndex = colIndex;
  }

  get pieceType() { return this._pieceType }
  set pieceType(value) { this._pieceType = value; }
  get rowIndex() { return this._rowIndex }
  get colIndex() { return this._colIndex }

  setPieceTypeBySymbolText(symbolText) {
    assert(
      values(PIECE_TYPE_SYMBOL_TEXTS).indexOf(symbolText) !== -1,
      `"${ symbolText }" is undefined symbol text`);
    Object.keys(PIECE_TYPE_SYMBOL_TEXTS).some(key => {
      const symbolText_ = PIECE_TYPE_SYMBOL_TEXTS[key];
      if (symbolText_ === symbolText) {
        this._pieceType = key;
        return true;
      }
    });
  }

  static reversePieceType(pieceType) {
    const nextPieceType = {
      [PIECE_TYPES.BLACK]: PIECE_TYPES.WHITE,
      [PIECE_TYPES.WHITE]: PIECE_TYPES.BLACK,
    }[pieceType];
    assert.notStrictEqual(nextPieceType, undefined, pieceType + ' is invalid pieceType');
    return nextPieceType;
  }

  reverse() {
    this._pieceType = Square.reversePieceType(this._pieceType);
  }
}


module.exports = {
  Square,
};
