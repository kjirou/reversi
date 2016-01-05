'use strict';


const DIRECTIONS = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

const DIRECTION_NAMES = {
  UP: 0,
  UP_RIGHT: 1,
  RIGHT: 2,
  DOWN_RIGHT: 3,
  DOWN: 4,
  DOWN_LEFT: 5,
  LEFT: 6,
  UP_LEFT: 7,
};

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

const PRESET_RULE_TYPES = {
  NOT_USE: 'NOT_USE',
  STANDARD: 'STANDARD',
};


module.exports = {
  DIRECTIONS,
  DIRECTION_NAMES,
  PIECE_TYPES,
  PIECE_TYPE_SYMBOL_TEXTS,
  PRESET_RULE_TYPES,
};
