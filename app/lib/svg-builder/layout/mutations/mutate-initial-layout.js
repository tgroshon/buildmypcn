'use strict';

var constants = require('../../constants');

module.exports = function mutateInitialLayout(layoutGraph) {
  layoutGraph.region.forEach(function(region, regionNum) {
    region.forEach(function(node, row) {
      node.y = (row + 1) * constants.ROW_SPACE + constants.ROW_OFFSET;
      node.x = regionNum * constants.REGION_WIDTH + constants.REGION_OFFSET;
    });
  });
}
