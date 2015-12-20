#!/usr/bin/env node

var assert = require('assert');

var reversi = require('../index');
var Game = reversi.Game;
var PRESET_RULE_TYPES = reversi.PRESET_RULE_TYPES;


var game = new Game({
  presetRuleType: PRESET_RULE_TYPES.NOT_USE,
  mapText: [
    '----',
    '-xo-',
    '-oo-',
    '----',
  ].join('\n'),
});

console.log(game.toText());
//
//  0123
// 0----
// 1-xo-
// 2-oo-
// 3----
// x: 1, o: 3
// > Place a "x" piece
//
