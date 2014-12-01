'use strict';

var LayoutGraph = require('./layout/LayoutGraph');
var svgBuilder = require('./svg/builder');

module.exports = function(pcn) {
  var layoutGraph = new LayoutGraph(pcn);
  var root = svgBuilder(pcn.metadata.title, layoutGraph);

  return root.toString();
};

