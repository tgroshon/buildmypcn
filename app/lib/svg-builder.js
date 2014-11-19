'use strict';

var builder = require('xmlbuilder');

module.exports = function(pcn) {
  var root = svgTemplate();

  return root.toString();
}

function svgTemplate(diagramTitle, domains) {
  var root = builder.create('svg', {version: '1.0', encoding: 'UTF-8', standalone: true},
                     {pubID: null, sysID: null},
                     {allowSurrogateChars: false, skipNullAttributes: false, 
                      headless: true, ignoreDecorators: false, stringify: {}});

  root.att('viewBox', "0 0 1080 1120");
  root.att('xmlns', "http://www.w3.org/2000/svg");
  root.ele('title', 'PCN Diagram');

  // TODO: Set Diagram Title Text
  root.ele('text', {x: 100, y: 100}, 'Some text');

  var backgroundGroup = root.ele('g');
  backgroundGroup.ele('title', 'Background');
  backgroundGroup.ele('path', {
    stroke: '#428bca',
    'stroke-width': '2',
    fill: 'none',
    d: 'm0,0l540,120l540,-120m0,120l-1080,0m180,0l0,444m180,0l0,-444m360,0l0,444m180,0l0,-444'
  });

  // TODO: Set Domain Names
  
  return root;
}
