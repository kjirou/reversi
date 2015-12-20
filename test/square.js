'use strict';

const assert = require('assert');

const consts = require('../lib/consts');
const PIECE_TYPES = consts.PIECE_TYPES;
const PIECE_TYPE_SYMBOL_TEXTS = consts.PIECE_TYPE_SYMBOL_TEXTS;
const Square = require('../lib/square').Square;


describe('lib/square', () => {

  it('setPieceTypeBySymbolText', () => {
    const square = new Square(0, 0);
    assert.strictEqual(square.pieceType, PIECE_TYPES.BLANK);

    square.setPieceTypeBySymbolText(PIECE_TYPE_SYMBOL_TEXTS.BLACK);
    assert.strictEqual(square.pieceType, PIECE_TYPES.BLACK);

    square.setPieceTypeBySymbolText(PIECE_TYPE_SYMBOL_TEXTS.WHITE);
    assert.strictEqual(square.pieceType, PIECE_TYPES.WHITE);

    assert.throws(() => {
      square.setPieceTypeBySymbolText('z');
    }, /AssertionError/);
  })
});
