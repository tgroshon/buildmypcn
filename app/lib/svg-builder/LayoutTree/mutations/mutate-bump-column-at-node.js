'use strict';

var constants = require('../../constants');

module.exports = function mutateBumpColumnAtNode(node, layoutTree, startY) {
  var prevY = startY;
  if (node.y === startY) {
    node.y = startY + constants.ROW_SPACE + constants.STEP_HEIGHT;
  } else {
    node.y = startY + constants.ROW_SPACE;
  }

  prevY = node.y;
  var column = layoutTree.region[node.region];
  for (var i = node.row + 1; i < column.length; i++) {
    column[i].y = prevY + constants.ROW_SPACE;
    prevY = column[i].y;
  }
}
