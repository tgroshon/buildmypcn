'use strict';

var constants = require('../../constants');
var genStepTitleAttrs = require('../generators/generate-step-title-attrs');
var genConnectorAttrs = require('../generators/generate-connector-attrs');
var genStepConfig = require('../generators/generate-step-config');

function truncateTitle(title) {
  return title.length > constants.TITLE_MAX_LENGTH ? title.substring(0, constants.TITLE_MAX_LENGTH) + '...' : title;
}

module.exports = function renderLayoutToRoot(root, layoutGraph) {
  var container = root.ele('g');
  var node, conf;

  Object.keys(layoutGraph.nodeStore).forEach(function(id) {
    node = layoutGraph.nodeStore[id];

    conf = genStepConfig(node);  
    container.ele(conf.name, conf.attrs);
    container.ele('text', genStepTitleAttrs(node), truncateTitle(node.title));

    node.predecessors.forEach(function (relation) {
      container.ele('line', genConnectorAttrs(layoutGraph.nodeStore[relation.id], node, relation.type));
    });
  });
};
