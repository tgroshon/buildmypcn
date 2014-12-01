'use strict';

module.exports = function mutateAddShapeDefs(root) {
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
  });

  markerArrow.ele('path', {
    d: 'm100,50 l-100,40 l30,-40 l-30,-40 l100,40 z',
    stroke: '#00007f',
    fill: '#00007f',
  });

  // TODO: Add these?
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
};
