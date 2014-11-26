'use strict';

var builder = require('xmlbuilder');

var DIAGRAM_WIDTH = 1260;
var ROW_SPACE = 100;
var ROW_OFFSET = 40;
var REGION_WIDTH = 180;
var REGION_OFFSET = 10;
var STEP_TYPES = {
  WAIT: 'wait',
  PROCESS: 'process',
  DECISION: 'decision',
  DIVERGENT: 'divergent_process'
};

module.exports = function(pcn) {
  var root = svgTemplate(pcn.metadata.title, pcn.domains);

  var layoutTree = createLayoutTree(pcn)
  mutInitialLayoutOfsteps(root, layoutTree);
  // mutAdjustSteps(root, layoutTree);
  
  layoutTree.region.forEach(function(reg, i) {
    console.log('Region', i, ':', JSON.stringify(reg));
  });
  return root.toString();
}


function mutInitialLayoutOfsteps(root, layoutTree) {
  
  // TODO: lookup existing container
  var container = root.ele('g');

  layoutTree.region.forEach(function(region, regionNum) {
    region.forEach(function(node, row) {
      var y = (row + 1) * ROW_SPACE;
      y += ROW_OFFSET;

      var x = regionNum * REGION_WIDTH;
      x += REGION_OFFSET;
      
      var conf = genConfig(node, x, y);  
      container.ele(conf.name, conf.attrs);
    });
  });
}

function genConfig(node, xPos, yPos) {
  var config = Object.create(null);

  switch (node.type) {
    case STEP_TYPES.WAIT:
      config.attrs = {
        d: 'm' + xPos + ',' + yPos + ' m-5,0 l170,0 l-10,60 l-150,0 z',
        stroke: '#00007f',
        fill: '#fffff0'
      };
      config.name = 'path';
      return config;
    case STEP_TYPES.DIVERGENT:
    case STEP_TYPES.DECISION:
      config.attrs = {
        d: 'm' + xPos + ',' + yPos + ' m10,0 l140,0 l10,10 l0,40 l-10,10 l-140,0 l-10,-10 l0,-40 z',
        stroke: '#00007f',
        fill: '#fffff0'
      };
      config.name = 'path';
      return config;
    case STEP_TYPES.PROCESS:
      config.attrs = {
        height: 60,
        width: REGION_WIDTH - 20,
        x: xPos,
        y: yPos,
        stroke: '#00007f',
        fill: '#fffff0'
      };
      config.name = 'rect';
      return config;
    default: 
      throw new Error('Bad Step Box State: ' + [JSON.stringify(node), xPos, yPos].join('; '));
  }
}
function createLayoutTree(pcn) {
  var tree = new LayoutTree(pcn);

  pcn.steps.forEach(function(step) {
    var region = lookupRegion(step, tree.provider, tree.consumer);
    var node = new LayoutNode(step, region);
    tree.region[region].push(node);
  });

  return tree;
}

function LayoutTree(pcn) {
  this.raw = pcn;
  this.provider = pcn.domains[0];
  this.consumer = pcn.domains[1];
  this.region = [[],[],[],[],[],[],[]];
}

function LayoutNode(step, region) {
  this.id = step.id;
  this.title = step.title;
  this.region = region;
  this.xMultiplier = 
  this.type = step.type;
  this.x = null;
  this.y = null;
  //this.raw = step;
}

function lookupRegion(step, provider, consumer) {
   if (step.domain.region.type === 'independent' && step.domain.id === provider.id) {
    return 0;
  } else if (step.domain.region.type === 'surrogate' && step.domain.id === provider.id) {
    return 1;
  } else if (step.domain.region.type === 'direct_leading' && step.domain.id === provider.id) {
    return 2;
  } else if (step.domain.region.type === 'direct_shared') {
    return 3;
  } else if (step.domain.region.type === 'direct_leading' && step.domain.id === consumer.id) {
    return 4;
  } else if (step.domain.region.type === 'surrogate' && step.domain.id === consumer.id) {
    return 5;
  }else if (step.domain.region.type === 'independent' && step.domain.id === consumer.id) {
    return 6;
  }
  throw new Error('Bad Region State: ' + JSON.stringify(step));
}

function mutAdjustSteps(root, layoutTree) {

}

function svgTemplate(diagramTitle, domains) {
  var root = builder.create('svg',
                          {version: '1.0', encoding: 'UTF-8', standalone: true},
                          {pubID: null, sysID: null},
                          {allowSurrogateChars: false, skipNullAttributes: false, 
                          headless: true, ignoreDecorators: false, stringify: {}});

  root.att('viewBox', "0 0 " + DIAGRAM_WIDTH + " 1120");
  root.att('xmlns', "http://www.w3.org/2000/svg");
  root.ele('title', 'PCN Diagram');

  var backgroundGroup = root.ele('g');
  backgroundGroup.ele('title', 'Background');
  backgroundGroup.ele('path', {
    stroke: '#428bca',
    'stroke-width': '2',
    fill: 'none',
    d: 'm0,0 l630,120 l630,-120 m0,120 l-1260,0 m180,0 l0,444 m180,0 l0,-444 m540,0 l0,444 m180,0 l0,-444'
  });
  

  root.ele('text', {x: DIAGRAM_WIDTH / 2, y: 50, 'font-size': 24, 'text-anchor': 'middle'}, diagramTitle);
  root.ele('text', {x: REGION_OFFSET, y: 100, 'font-size': 24, 'text-anchor': 'start'}, domains[0].title);
  root.ele('text', {x: DIAGRAM_WIDTH - REGION_OFFSET, y: 100, 'font-size': 24, 'text-anchor': 'end'}, domains[1].title);
  root.ele('g', {class: 'js__grapher-step-container'});

  return root;
}
