'use strict';

var constants = require('../constants');
var LayoutNode = require('./LayoutNode');
var lookupRegion = require('./lookup-region');
var mutateInitialLayout = require('./mutations/mutate-initial-layout');
var mutateAdjustLayoutForRelations = require('./mutations/mutate-adjust-layout-for-relations');

function LayoutGraph(pcn) {
  this.raw = pcn;
  this.provider = pcn.domains[0];
  this.consumer = pcn.domains[1];
  this.region = [[],[],[],[],[],[],[]];
  this.nodeStore = {};
  this.length = 0;

  pcn.steps.forEach(function(step) {
    var region = lookupRegion(step, this.provider, this.consumer);
    var node = new LayoutNode(step, region);
    this.addNode(node);
  }.bind(this));

  mutateInitialLayout(this);
  mutateAdjustLayoutForRelations(this);
}

LayoutGraph.prototype.addNode = function (node) {
  this.nodeStore[node.id] = node;
  this.length += 1;

  var column = this.region[node.region];
  node.row = column.length;
  column.push(node);
};

LayoutGraph.prototype.maxRows = function () {
  return Math.max.apply(null, this.region.map(function (reg) { return reg.length; }));
};

LayoutGraph.prototype.getBottomY = function() {
  var yArray = Object.keys(this.nodeStore).map(function(id) {
    return this.nodeStore[id].y;
  }.bind(this));
  return Math.max.apply(null, yArray) + constants.STEP_HEIGHT + constants.ROW_SPACE;
};

module.exports = LayoutGraph;
