'use strict';
var constants = require('../../constants');

module.exports = function genHeaderAttrs(node) {
  return {
    'x': constants.REGION_OFFSET,
    'y': 150,
    'font-size': 16,
    'text-anchor': 'start',
    'font-family': 'Verdana',
    'fill': '#2196F3',
    'text-decoration': 'underline'
  };
};
