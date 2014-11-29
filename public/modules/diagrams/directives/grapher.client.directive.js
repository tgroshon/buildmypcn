/*global $ */
'use strict';

function createElement(name, attrs) {
  var element = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.keys(attrs).forEach(function (key) {
    element.setAttributeNS(null, 
                           key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
                           attrs[key].toString());
  });
  return element;
}

//Diagrams service used to communicate Diagrams REST endpoints
angular.module('diagrams').directive('grapher', ['$parse', '$document',
  function($parse, $document) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'modules/diagrams/views/grapher.client.view.html',
      scope: {
        diagram: '=pcn'
      },
      compile: function(tElement, tAttrs) {
        // Process the PCN Data
        
        return function preLink(scope, element, attrs) {
          var text = createElement('text', {
            fontSize: 22,
            y: 180,
            x: 100
          });
          text.textContent = 'Welcome to the Jungle';

          var container = element.find('g.js__grapher-step-container');
          container.append(text);
        };
      }
    };
  }
]);

function textWrapSVG(text, textx, texty, width) { 
  //returns boundary constrained SVG text jQuery object
  var textObject = $('<text font-family="Serif" font-size="large" fill="#ff0000" text-anchor="left" x="'+textx+'" y="'+texty+'" width="'+width+'" height="80"></text>');
 
  var allwords = text.split(' ');
  allwords.push('~DUMMY~'); //dummy marker to show the end - simplifies
  var nextword = allwords.shift();
  var nextwordlen = nextword.length;
  var line = nextword;  //grab the first word
  var tspan_element = document.getElementById('debugtspan');
  tspan_element.innerHTML = line;
  var dx = 0;
  var linecount = 0;
 
  for(var i=0; i < allwords.length; i++) {
      nextword = allwords[i];
      nextwordlen = nextword.length;
      
      var len = tspan_element.innerHTML.length;
      tspan_element.innerHTML = line + ' ' + nextword;
      if (tspan_element.getComputedTextLength() > width || nextword === '~DUMMY~') {
        tspan_element.innerHTML = line;
        var linewidth = tspan_element.getComputedTextLength();
        var linehalf = -Math.round(linewidth/2);
        if (dx === 0) { //first line
          textObject.append(('<tspan dx="'+(width/2+linehalf)+'">'+line+'</tspan>')); //tack it on
        } else {
          dx += linehalf; //subtract half of the current line
          textObject.append(('<tspan dx="'+dx+'" dy="20">'+line+'</tspan>')); //tack it on
        }
        dx = linehalf;
          tspan_element.innerHTML = nextword;    // use leftover word
          line = nextword;  //start next line
        linecount ++;
      } else {
        line += ' ' + nextword;
      }
  }
  textObject.attr('y', texty + 30 - (linecount * 10));
 
  return textObject;
}

function grapherBFG(container, steps) {
  var regions = {
    'provider-independent' : 1,
    'provider-surrogate' : 2,
    'provider-direct' : 3,
    'both-direct' : 3.5,
    'customer-direct' : 4,
    'customer-surrogate' : 5,
    'customer-independent' : 6,
    'r1' : 1,
    'r2' : 2,
    'r3' : 3,
    'r4' : 3.5,
    'r5' : 4,
    'r6' : 5,
    'r7' : 6
  };
  var TOP_HEIGHT = 120;
  var REGION_WIDTH = 180;
  var x1 = 0; //coordinates of last step
  var y1 = TOP_HEIGHT + 25 - 60; //step 0 is 100 up
  var last_step_number = 999; //should not use 999
  var step_box = null; //always delays steps for layers over lines
 
  steps.forEach(function (step, index) {
    step.number = index + 1; //set number
    step.diagram = {};
 
    var x = 1;
    if (step.region && regions[step.region] > 0) {
      x = (regions[step.region] - 1) * REGION_WIDTH + 10;
    } else {
      x = 1;
    }
 
    var follows = step.follows;
    var y = y1 + 100;
 
    if (!follows) {
      y = y1 + 60;
    } else if (follows === 0 || follows === 'start') {
      y = TOP_HEIGHT + 25;
    } else if (follows && follows > 0 && steps[follows] && steps[follows].diagram.y) {
      y = steps[follows].diagram.y + 100;
    } else {
      y = y1 + 60;
    }

    step.diagram.y = y; //save it so can use later
 
    //CONNECTOR LINE
    var x2 = x + 90; //coordinates of end point
    var y2 = y + 40;
    if (follows === 0 || follows === 'start') {
      console.log('First Step ... no connector line');
    } else {
      if (x1 > 0) {
        var x1a = (x1 * 1 + x2 * 1) / 2;
        var y1a = (y1 * 1 + y2 * 1) / 2;
 
        var marker = 'markerArrow';
        follows = step.follows || '';
        if (/yes/.test(follows)) {
          marker = 'markerYes';
        } else if (/no/.test(follows)) {
          marker = 'markerNo';
        }
        container.append('<polyline stroke="#00007f" marker-mid="url(#' + marker + ')" id="svg_line' + step.number + '" fill="none" stroke-width="2" points="' + x1 + ' ' + y1 + ' ' + x1a + ' ' + y1a + ' ' + x2 + ' ' + y2 + '" se:connector="svg_' + last_step_number + ' svg_' + step.number + '" />');
      }
    }
    x1 = x2;
    y1 = y2;
    last_step_number = step.number; //in case we wind up skipping a step
 
    //STEP BOX
    if (step_box)
      container.append(step_box);
 
    var stroke_width = 2;
    if (step.box_thick)
      stroke_width = 4;
    var stroke_dash = 'null';
    if (step.box_dash)
      stroke_dash = '5,5';
 
    //new step box
    step_box = $('<g></g>'); //always delays steps for layers over lines
    if (step.type === 'wait') {
      step_box.append('<path id="svg_' + step.number + '" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="' + stroke_dash + '" stroke-width="' + stroke_width + '" stroke="#00007f" fill="#fffff0" d="m' + x + ',' + y +
        ' m-5,0 l170,0 l-10,60 l-150,0 z" />');
    } else if (step.type === 'decision') {
      step_box.append('<path id="svg_' + step.number + '" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="' + stroke_dash + '" stroke-width="' + stroke_width + '" stroke="#00007f" fill="#fffff0" d="m' + x + ',' + y +
        ' m10,0 l140,0 l10,10 l0,40 l-10,10 l-140,0 l-10,-10 l0,-40 z" />');
    } else {
      step_box.append('<rect id="svg_' + step.number + '" height="60" width="' + (REGION_WIDTH - 20) + '" y="' + y + '" x="' + x + '" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="' + stroke_dash + '" stroke-width="' + stroke_width + '" stroke="#00007f" fill="#fffff0" />');
    }
 
    var textx = x * 1 + 5;
    var texty = y * 1 + 5 + 10;
    step_box.append(textWrapSVG(step.step, textx, texty, REGION_WIDTH - 30));
 
    container.append(step_box); //append the last step box
  });
 
 
  return container;
}