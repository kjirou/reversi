'use strict';

const consts = require('./lib/consts');
const game = require('./lib/game');


module.exports = {
  PIECE_TYPES: consts.PIECE_TYPES,
  PRESET_RULE_TYPES: consts.PRESET_RULE_TYPES,
  Game: game.Game,
};
