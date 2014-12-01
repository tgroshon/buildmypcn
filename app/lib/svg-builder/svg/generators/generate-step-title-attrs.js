'use strict';
var constants = require('../../constants');

module.exports = function genStepTitleAttrs(node) {
  return {
    'x': node.x + constants.TEXT_X_OFFSET,
    'y': node.y + constants.TEXT_Y_OFFSET,
    'fill': '#ffffff',
    'font-family': 'Verdana',
    'font-size': 12
  };
};
