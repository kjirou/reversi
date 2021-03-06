'use strict';

const board = require('./lib/board');
const consts = require('./lib/consts');
const game = require('./lib/game');
const square = require('./lib/square');


module.exports = {
  DIRECTIONS: consts.DIRECTIONS,
  DIRECTION_NAMES: consts.DIRECTION_NAMES,
  PIECE_TYPES: consts.PIECE_TYPES,
  PRESET_RULE_TYPES: consts.PRESET_RULE_TYPES,
  Board: board.Board,
  Game: game.Game,
  Square: square.Square,
};
