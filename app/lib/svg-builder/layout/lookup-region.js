'use strict';

var constants = require('../constants');

module.exports = function lookupRegion(step, provider, consumer) {
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
};

