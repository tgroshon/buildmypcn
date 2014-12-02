'use strict';

var constants = require('../../constants');
var genBackgroundAttrs = require('../generators/generate-background-attrs');
var mutateAddHeaders = require('./mutate-add-headers');

module.exports = function(root, diagramTitle, layoutGraph) {
  var bottom = layoutGraph.getBottomY();
  root.att('viewBox', '0 0 ' + constants.DIAGRAM_WIDTH + ' ' + bottom);

  var backgroundGroup = root.ele('g', {class: 'grapher-background-container'});
  backgroundGroup.ele('title', 'Background');
  backgroundGroup.ele('path', genBackgroundAttrs(bottom));
  
  var titleAttrs = {
    'x': constants.DIAGRAM_WIDTH / 2,
    'y': 50,
    'font-size': 24,
    'text-anchor': 'middle',
    'font-family': 'Verdana'
  };
  var providerAttrs = {
    'x': constants.REGION_OFFSET,
    'y': 100,
    'font-size': 24,
    'text-anchor': 'start',
    'font-family': 'Verdana'
  };
  var consumerAttrs = {
    'x': constants.DIAGRAM_WIDTH - constants.REGION_OFFSET,
    'y': 100,
    'font-size': 24,
    'text-anchor': 'end',
    'font-family': 'Verdana'
  };

  root.ele('text', titleAttrs, diagramTitle);
  root.ele('text', providerAttrs, layoutGraph.provider.title);
  root.ele('text', consumerAttrs, layoutGraph.consumer.title);

  mutateAddHeaders(root);
};

