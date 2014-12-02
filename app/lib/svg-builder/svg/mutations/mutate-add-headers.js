'use strict';

var constants = require('../../constants');
var genHeaderAttrs = require('../generators/generate-header-attrs');

module.exports = function mutateAddHeaders(root) {
  var headerAttrs = genHeaderAttrs();
  root.ele('text', headerAttrs, 'Independent');
  headerAttrs.x = constants.REGION_WIDTH + constants.REGION_OFFSET;
  root.ele('text', headerAttrs, 'Surrogate');
  headerAttrs.x = constants.REGION_WIDTH * 3 + constants.REGION_OFFSET;
  root.ele('text', headerAttrs, 'Direct Interaction');
  headerAttrs.x = constants.REGION_WIDTH * 5 + constants.REGION_OFFSET;
  root.ele('text', headerAttrs, 'Surrogate');
  headerAttrs.x = constants.REGION_WIDTH * 6 + constants.REGION_OFFSET;
  root.ele('text', headerAttrs, 'Independent');
}
