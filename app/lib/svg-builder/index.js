'use strict';

var LayoutTree = require('./LayoutTree');
var svgBuilder = require('./svg/builder');

module.exports = function(pcn) {
  var layoutTree = new LayoutTree(pcn);
  var root = svgBuilder(pcn.metadata.title, layoutTree);

  return root.toString();
};

