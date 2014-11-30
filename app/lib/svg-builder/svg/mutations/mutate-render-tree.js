'use strict';

var helpers = require('../../helpers');
var constants = require('../../constants');

module.exports = function renderLayoutToRoot(root, layoutTree) {
  var container = root.ele('g');
  var node, conf;

  Object.keys(layoutTree.nodeStore).forEach(function(id) {
    node = layoutTree.nodeStore[id];

    conf = helpers.genStepConfig(node);  
    container.ele(conf.name, conf.attrs);
    container.ele('text', helpers.genStepTitleAttrs(node), helpers.truncateTitle(node.title));

    node.predecessors.forEach(function (relation) {
      container.ele('line', helpers.genConnectorAttrs(layoutTree.nodeStore[relation.id], node, relation.type));
    });
  });
}
