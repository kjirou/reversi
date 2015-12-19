'use strict';


const PIECE_TYPES = {
  BLACK: 'BLACK',
  BLANK: 'BLANK',
  WHITE: 'WHITE',
};

const PIECE_TYPE_SYMBOL_TEXTS = {
  [PIECE_TYPES.BLACK]: 'x',
  [PIECE_TYPES.BLANK]: '-',
  [PIECE_TYPES.WHITE]: 'o',
};

module.exports = {
  PIECE_TYPES,
  PIECE_TYPE_SYMBOL_TEXTS,
};
