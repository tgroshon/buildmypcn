'use strict';

exports.DIAGRAM_WIDTH = 1260;
exports.ROW_SPACE = 100;
exports.ROW_OFFSET = 40;
exports.REGION_WIDTH = 180;
exports.REGION_OFFSET = 10;
exports.STEP_HEIGHT = 60;
exports.STEP_WIDTH = exports.REGION_WIDTH - 20;
exports.TEXT_X_OFFSET = 5;
exports.TEXT_Y_OFFSET = exports.STEP_HEIGHT / 2;

exports.STEP_TYPES = {
  WAIT: 'wait',
  PROCESS: 'process',
  DECISION: 'decision',
  DIVERGENT: 'divergent_process'
};
