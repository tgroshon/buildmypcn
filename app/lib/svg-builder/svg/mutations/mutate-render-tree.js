'use strict';

var helpers = require('../../helpers');
var constants = require('../../constants');

module.exports = function renderLayoutToRoot(root, layoutGraph) {
  var container = root.ele('g');
  var node, conf;

  Object.keys(layoutGraph.nodeStore).forEach(function(id) {
    node = layoutGraph.nodeStore[id];

    conf = helpers.genStepConfig(node);  
    container.ele(conf.name, conf.attrs);
    container.ele('text', helpers.genStepTitleAttrs(node), helpers.truncateTitle(node.title));

    node.predecessors.forEach(function (relation) {
      container.ele('line', helpers.genConnectorAttrs(layoutGraph.nodeStore[relation.id], node, relation.type));
    });
  });
}
