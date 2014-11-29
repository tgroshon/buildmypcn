'use strict';

var constants = require('./constants');

exports.lookupRegion = function lookupRegion(step, provider, consumer) {
   if (step.domain.region.type === 'independent' && step.domain.id === provider.id) {
    return 0;
  } else if (step.domain.region.type === 'surrogate' && step.domain.id === provider.id) {
    return 1;
  } else if (step.domain.region.type === 'direct_leading' && step.domain.id === provider.id) {
    return 2;
  } else if (step.domain.region.type === 'direct_shared') {
    return 3;
  } else if (step.domain.region.type === 'direct_leading' && step.domain.id === consumer.id) {
    return 4;
  } else if (step.domain.region.type === 'surrogate' && step.domain.id === consumer.id) {
    return 5;
  }else if (step.domain.region.type === 'independent' && step.domain.id === consumer.id) {
    return 6;
  }
  throw new Error('Bad Region State: ' + JSON.stringify(step));
};

exports.genStepConfig = function genStepConfig(node) {
  var config = Object.create(null);

  switch (node.type) {
    case constants.STEP_TYPES.WAIT:
      config.attrs = {
        title: node.title,
        d: 'm' + node.x + ',' + node.y + ' m-5,0 l170,0 l-10,60 l-150,0 z',
        stroke: '#00007f',
        fill: '#fffff0'
      };
      config.name = 'path';
      return config;
    case constants.STEP_TYPES.DIVERGENT:
    case constants.STEP_TYPES.DECISION:
      config.attrs = {
        title: node.title,
        d: 'm' + node.x + ',' + node.y + ' m10,0 l140,0 l10,10 l0,40 l-10,10 l-140,0 l-10,-10 l0,-40 z',
        stroke: '#00007f',
        fill: '#fffff0'
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
        stroke: '#00007f',
        fill: '#fffff0'
      };
      config.name = 'rect';
      return config;
    default: 
      throw new Error('Bad Step Box State: ' + JSON.stringify(node));
  }
};

function relationIsLeftToRightBetween(startNode, endNode) {
  return startNode.region < endNode.region && startNode.region !== endNode.region;
}

function relationIsRightToLeftBetween(startNode, endNode) {
  return startNode.region > endNode.region && startNode.region !== endNode.region;
}

exports.genConnectorAttrs = function genConnectorAttrs(startNode, endNode, lineType) {
  var attrs = {'stroke': 'black', 'stroke-width': '2'};
  if (lineType.indexOf('normal') >= 0) {
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

  attrs['marker-end'] = 'url(#markerArrow)';
  return attrs;
};

