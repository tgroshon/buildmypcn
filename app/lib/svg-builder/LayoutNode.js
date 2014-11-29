'use strict';

function LayoutNode(step, region) {
  this.id = step.id;
  this.title = step.title;
  this.type = step.type;
  this.predecessors = step.predecessors;
  this.region = region;
  this.row = 0;
  this.x = null;
  this.y = null;
}

module.exports = LayoutNode;
