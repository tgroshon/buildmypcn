'use strict';
var constants = require('../../constants');

module.exports = function genStepConfig(node) {
  var config = Object.create(null);

  switch (node.type) {
    case constants.STEP_TYPES.WAIT:
      config.attrs = {
        title: node.title,
        d: 'm' + node.x + ',' + node.y + ' m-5,0 l170,0 l-10,60 l-150,0 z',
        stroke: '#43A047',
        fill: '#4CAF50'
      };
      config.name = 'path';
      return config;
    case constants.STEP_TYPES.DIVERGENT:
    case constants.STEP_TYPES.DECISION:
      config.attrs = {
        title: node.title,
        d: 'm' + node.x + ',' + node.y + ' m10,0 l140,0 l10,10 l0,40 l-10,10 l-140,0 l-10,-10 l0,-40 z',
        stroke: '#D81B60',
        fill: '#E91E63'
      };
      config.name = 'path';
      return config;
    case constants.STEP_TYPES.PROCESS:
      config.attrs = {
        title: node.title,
        height: constants.STEP_HEIGHT,
        width: constants.STEP_WIDTH,
        x: node.x,
        y: node.y,
        stroke: '#1E88E5',
        fill: '#2196F3'
      };
      config.name = 'rect';
      return config;
    default: 
      throw new Error('Bad Step Box State: ' + JSON.stringify(node));
  }
};
