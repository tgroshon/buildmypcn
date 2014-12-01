/* jshint loopfunc: true */
'use strict';

var mutateBumpColumnAtNode = require('./mutate-bump-column-at-node');

module.exports = function mutateAdjustLayoutForRelations(layoutGraph) {
  var node, preNode, region;
  var maxRows = layoutGraph.maxRows();

  for (var row = 0; row < maxRows; row++) {
    for (var col = 0; col < layoutGraph.region.length; col++) {
      region = layoutGraph.region[col];
      if (row < region.length) {
        node = region[row]; 
        node.predecessors.forEach(function(relation) {
          preNode = layoutGraph.nodeStore[relation.id];
          if (!preNode) { console.log('\n\n', relation.id, Object.keys(layoutGraph.nodeStore))}
          if (preNode.y >= node.y) {
            mutateBumpColumnAtNode(node, layoutGraph, preNode.y);
          }
        });
      }
    }
  }
};
