'use strict';

var builder = require('xmlbuilder');
var LayoutTree = require('./LayoutTree');
var constants = require('./constants');
var helpers = require('./helpers');
var relationIsLeftToRightBetween = helpers.relationIsLeftToRightBetween;
var relationIsRightToLeftBetween = helpers.relationIsRightToLeftBetween;

module.exports = function(pcn) {
  var root = svgTemplate(pcn.metadata.title, pcn.domains);
  var layoutTree = new LayoutTree(pcn);

  mutInitialLayoutOfsteps(layoutTree);
  mutAdjustSteps(layoutTree);
  mutRenderLayoutTree(root, layoutTree);
  mutAdjustDiagramSize(root, layoutTree);

  return root.toString();
}

function mutAdjustSteps(layoutTree) {
  var node, preNode, region;
  var maxRows = layoutTree.maxRows();

  for (var row = 0; row < maxRows; row++) {
    for (var col = 0; col < layoutTree.region.length; col++) {
      region = layoutTree.region[col];
      if (row < region.length) {
        node = region[row]; 
        node.predecessors.forEach(function(relation) {
          preNode = layoutTree.nodeStore[relation.id];
          if (preNode.y >= node.y) {
            mutBumpNode(node, layoutTree, preNode.y);
          }
        });
      }
    }
  }
}


function mutBumpNode(node, layoutTree, startY) {
  var prevY = startY;
  if (node.y == startY) {
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

function mutRenderLayoutTree(root, layoutTree) {
  var container = root.ele('g');
  var node, conf;

  Object.keys(layoutTree.nodeStore).forEach(function(id) {
    node = layoutTree.nodeStore[id];
    conf = helpers.genStepConfig(node);  
    container.ele(conf.name, conf.attrs);
    container.ele('text', {x: node.x + constants.TEXT_X_OFFSET, y: node.y + constants.TEXT_Y_OFFSET}, node.title);
    mutRenderPredecessorConnections(container, node, layoutTree);
  });
}

function mutRenderPredecessorConnections(container, node, layoutTree) {
  node.predecessors.forEach(function (relation) {
    container.ele('line', helpers.genConnectorAttrs(layoutTree.nodeStore[relation.id], node, relation.type));
  });
}


function mutAdjustDiagramSize(root, layoutTree) {
  var bottom = layoutTree.getBottomY() + constants.STEP_HEIGHT + constants.ROW_SPACE;
  root.att('viewBox', '0 0 ' + constants.DIAGRAM_WIDTH + ' ' + bottom);
}

function mutInitialLayoutOfsteps(layoutTree) {
  layoutTree.region.forEach(function(region, regionNum) {
    region.forEach(function(node, row) {
      node.y = (row + 1) * constants.ROW_SPACE + constants.ROW_OFFSET;
      node.x = regionNum * constants.REGION_WIDTH + constants.REGION_OFFSET;
    });
  });
}


function createLayoutTree(pcn) {
  var tree = new LayoutTree(pcn);

  return tree;
}

function svgTemplate(diagramTitle, domains) {
  var root = builder.create('svg',
                          {version: '1.0', encoding: 'UTF-8', standalone: true},
                          {pubID: null, sysID: null},
                          {allowSurrogateChars: false, skipNullAttributes: false, 
                          headless: true, ignoreDecorators: false, stringify: {}});
  root.att('xmlns', "http://www.w3.org/2000/svg");
  root.ele('title', 'PCN Diagram');
  mutAddShapeDefs(root);

  var backgroundGroup = root.ele('g', {class: 'grapher-background-container'});
  backgroundGroup.ele('title', 'Background');
  backgroundGroup.ele('path', {
    stroke: '#428bca',
    'stroke-width': '2',
    fill: 'none',
    d: 'm0,0 l630,120 l630,-120 m0,120 l-1260,0 m180,0 l0,444 m180,0 l0,-444 m540,0 l0,444 m180,0 l0,-444'
  });
  
  root.ele('text', {x: constants.DIAGRAM_WIDTH / 2, y: 50, 'font-size': 24, 'text-anchor': 'middle'}, diagramTitle);
  root.ele('text', {x: constants.REGION_OFFSET, y: 100, 'font-size': 24, 'text-anchor': 'start'}, domains[0].title);
  root.ele('text', {x: constants.DIAGRAM_WIDTH - constants.REGION_OFFSET, y: 100, 'font-size': 24, 'text-anchor': 'end'}, domains[1].title);

  return root;
}

function mutAddShapeDefs(root) {
  var defs = root.ele('defs');
  var markerArrow = defs.ele('marker', {
    id: 'markerArrow',
    refY: '50',
    refX: '50',
    markerHeight: '7',
    markerWidth: '7',
    viewBox: '0 0 100 100',
    orient: 'auto',
    markerUnits: 'strokeWidth'
  })
  markerArrow.ele('path', {
    d: 'm100,50 l-100,40 l30,-40 l-30,-40 l100,40 z',
    stroke: '#00007f',
    fill: '#00007f',
  });

  //   <marker id="markerYes" refY="50" refX="80" markerHeight="10" markerWidth="20" viewBox="0 0 100 100" orient="auto">
  //     <rect height="105" width="76" y="-3" x="-79" stroke-width="5" fill="#ffffff" opacity="0.9"/>
  //     <path stroke-width="10" stroke="#00007f" fill="#00007f" d="m100,50l-100,40l30,-40l-30,-40l100,40z" />
  //     <text xml:space="preserve" text-anchor="center" font-family="serif" font-size="60" fill="#FF0000" y="70" x="-90" transform="rotate(-90 -45,47) ">
  //       yes
  //     </text>
  //   </marker>
  //   <marker refY="50" refX="80" markerHeight="10" markerWidth="20" viewBox="0 0 100 100" orient="auto" id="markerNo">
  //     <rect height="105" width="76" y="-3" x="-79" stroke-width="5" fill="#ffffff" opacity="0.7"/>
  //     <path stroke-width="10" stroke="#00007f" fill="#00007f" d="m100,50l-100,40l30,-40l-30,-40l100,40z" />
  //     <text xml:space="preserve" text-anchor="center" font-family="serif" font-size="60" fill="#FF0000" y="70" x="-90" transform="rotate(-90 -45,47) ">
  //       no
  //     </text>
  //   </marker>
}
