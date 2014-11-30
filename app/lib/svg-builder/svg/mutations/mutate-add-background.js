'use strict';

var constants = require('../../constants');
var helpers = require('../../helpers');

module.exports = function(root, diagramTitle, layoutTree) {
  var bottom = layoutTree.getBottomY();
  root.att('viewBox', '0 0 ' + constants.DIAGRAM_WIDTH + ' ' + bottom);

  var backgroundGroup = root.ele('g', {class: 'grapher-background-container'});
  backgroundGroup.ele('title', 'Background');
  backgroundGroup.ele('path', helpers.genBackgroundAttrs(bottom));
  
  var titleAttrs = {
    'x': constants.DIAGRAM_WIDTH / 2,
    'y': 50,
    'font-size': 24,
    'text-anchor': 'middle'
  };
  var providerAttrs = {
    'x': constants.REGION_OFFSET,
    'y': 100,
    'font-size': 24,
    'text-anchor': 'start'
  };
  var consumerAttrs = {
    'x': constants.DIAGRAM_WIDTH - constants.REGION_OFFSET,
    'y': 100,
    'font-size': 24,
    'text-anchor': 'end'
  };

  root.ele('text', titleAttrs, diagramTitle);
  root.ele('text', providerAttrs, layoutTree.provider.title);
  root.ele('text', consumerAttrs, layoutTree.consumer.title);
}

