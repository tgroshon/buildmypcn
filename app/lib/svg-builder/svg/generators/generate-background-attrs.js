'use strict';

module.exports = function genBackgroundAttrs(bottom) {
  var attrs =  {
    'stroke-width': 2,
    'stroke': '#2196F3',
    'fill': 'none',
  };
  var guidelineHeight = bottom - 200;
  var prefix = 'm0,0 l630,120 l630,-120 m0,120 l-1260,0';
  var postfix = 'm180,0 l0,' + guidelineHeight +
    'm180,0 l0,-' + guidelineHeight +
    'm540,0 l0,' + guidelineHeight + 
    'm180,0 l0,-' + guidelineHeight;

  attrs.d = prefix + ' ' + postfix;
  return attrs;
};
