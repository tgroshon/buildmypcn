'use strict';

var helpers = require('./helpers');
var LayoutNode = require('./LayoutNode');

function LayoutTree(pcn) {
  this.raw = pcn;
  this.provider = pcn.domains[0];
  this.consumer = pcn.domains[1];
  this.region = [[],[],[],[],[],[],[]];
  this.nodeStore = Object.create(null);
  this.length = 0;

  pcn.steps.forEach(function(step) {
    var region = helpers.lookupRegion(step, this.provider, this.consumer);
    var node = new LayoutNode(step, region);
    this.addNode(node, region);
  }.bind(this));
}

LayoutTree.prototype.addNode = function (node, region) {
  this.nodeStore[node.id] = node;
  this.length += 1;

  var column = this.region[region];
  node.row = column.length;
  column.push(node);
};

LayoutTree.prototype.maxRows = function () {
  return Math.max.apply(null, this.region.map(function (reg) { return reg.length; }));
};

LayoutTree.prototype.getBottomY = function() {
  var self = this;
  var yArray = Object.keys(self.nodeStore).map(function(id) {
    return self.nodeStore[id].y;
  });
  return Math.max.apply(null, yArray);
};

module.exports = LayoutTree;
