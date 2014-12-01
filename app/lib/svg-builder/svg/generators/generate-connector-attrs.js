'use strict';
var constants = require('../../constants');

function relationIsLeftToRightBetween(startNode, endNode) {
  return startNode.region < endNode.region && startNode.region !== endNode.region;
}

function relationIsRightToLeftBetween(startNode, endNode) {
  return startNode.region > endNode.region && startNode.region !== endNode.region;
}

function relationTypeIsDashed(lineType) {
  return lineType.indexOf('loose') >= 0;
}

module.exports = function genConnectorAttrs(startNode, endNode, lineType) {
  var attrs = {
    'stroke': 'black',
    'stroke-width': '1.5',
    'marker-end': 'url(#markerArrow)'
  };

  if (relationTypeIsDashed(lineType)) {
    attrs['stroke-dasharray'] = '5,5';
  }

  if (relationIsLeftToRightBetween(startNode, endNode)) {
    attrs.x1 = startNode.x + constants.STEP_WIDTH;
    attrs.y1 = startNode.y + (constants.STEP_HEIGHT / 2);
    attrs.x2 = endNode.x;
    attrs.y2 = endNode.y + (constants.STEP_HEIGHT / 2);
  } else if (relationIsRightToLeftBetween(startNode, endNode)) {
    attrs.x1 = startNode.x;
    attrs.y1 = startNode.y + (constants.STEP_HEIGHT / 2);
    attrs.x2 = endNode.x + constants.STEP_WIDTH;
    attrs.y2 = endNode.y + (constants.STEP_HEIGHT / 2);
  } else {
    attrs.x1 = startNode.x + (constants.STEP_WIDTH / 2);
    attrs.y1 = startNode.y + constants.STEP_HEIGHT;
    attrs.x2 = endNode.x + (constants.STEP_WIDTH / 2);
    attrs.y2 = endNode.y;
  }

  return attrs;
};
