'use strict';

var builder = require('xmlbuilder');
var constants = require('../constants');
var mutateAddShapeDefs = require('./mutations/mutate-add-shape-defs');
var mutateAddBackground = require('./mutations/mutate-add-background');
var mutateRenderTree = require('./mutations/mutate-render-tree');

module.exports = function svgTemplate(diagramTitle, layoutGraph) {
  var root = builder.create('svg',
                          {version: '1.0', encoding: 'UTF-8', standalone: true},
                          {pubID: null, sysID: null},
                          {allowSurrogateChars: false, skipNullAttributes: false, 
                          headless: true, ignoreDecorators: false, stringify: {}});
  root.att('xmlns', 'http://www.w3.org/2000/svg');
  root.ele('title', 'PCN Diagram');

  mutateAddShapeDefs(root);
  mutateAddBackground(root, diagramTitle, layoutGraph);
  mutateRenderTree(root, layoutGraph);

  return root;
};

