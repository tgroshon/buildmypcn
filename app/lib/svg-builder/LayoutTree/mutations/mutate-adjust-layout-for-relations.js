'use strict';

var mutateBumpColumnAtNode = require('./mutate-bump-column-at-node');

module.exports = function mutateAdjustLayoutForRelations(layoutTree) {
  var node, preNode, region;
  var maxRows = layoutTree.maxRows();

  for (var row = 0; row < maxRows; row++) {
    for (var col = 0; col < layoutTree.region.length; col++) {
      region = layoutTree.region[col];
      if (row < region.length) {
        node = region[row]; 
        node.predecessors.forEach(function(relation) {
          preNode = layoutTree.nodeStore[relation.id];
          if (preNode.y >= node.y) {
            mutateBumpColumnAtNode(node, layoutTree, preNode.y);
          }
        });
      }
    }
  }
}
