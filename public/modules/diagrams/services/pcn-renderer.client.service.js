'use strict';

angular.module('diagrams').factory('pcnRenderer', [ 'utils',
  function (utils) {
    var TOP_HEIGHT = 120;
    var REGION_WIDTH = 180;
    var CONNECTOR_X_OFFSET = REGION_WIDTH / 2;
    var STEP_TYPES = {
      WAIT: 'wait',
      PROCESS: 'process',
      DECISION: 'decision'
    };


    function findStepPath(start, steps) {
      var steps = utils.shallowClone(steps); // Clone so we can remove steps as we find them
      var path = [start];
      var successor;

      do {
        successor = utils.findAndRemove(steps, function (step) {
          return step.predecessors.some(function (predecessor) {
            return predecessor.id === start.id;
          });
        });

        if (successor) {
          path.push(successor);
          start = successor;
        }
      } while(successor);

      return path;
    }

    function renderPath(container, steps, provider, consumer) {
      var xStep = 0;
      var yStep = 0;
      var xTemp = 0;
      var yTemp = 0;
      var multiplier = 0;
      var tempBox;
      var box;
      var eConf;
      var groupElement;
      var connector;
      var connectorParams;
      var textElement;
      
      steps.forEach(function (nextStep, index) {
        // Create Connector if not first
        if (index > 0) {
          // TODO: calculate the connector line
          connectorParams = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
          };
          connector = utils.createElement('line', connectorParams);
          container.appendChild(connector);
        }

        // Create Element
        multiplier = lookupRegionMultiplier(nextStep, provider, consumer); 
        xStep = multiplier * REGION_WIDTH + 10; // TODO reduce multipliers by 1?
        yStep += 100; 

        eConf = genBoxConfig(nextStep, xStep, yStep);
        groupElement = utils.createElement('g');
        groupElement.appendChild(utils.createElement(eConf.name, eConf.attrs));

        // TODO: Wrap text in the bounds of the groupElement
        textElement = utils.createElement('text');
        textElement.textContent = nextStep.title;
        
        container.appendChild(groupElement);
        nextStep = nextStep.predecessors.shift();
      });
    }

    function genBoxConfig(step, xPos, yPos) {
      var config = Object.create(null);
      switch (step.type) {
        case STEP_TYPES.WAIT:
          config.attrs = {
            d: 'm' + xPos + ',' + yPos + ' m-5,0 l170,0 l-10,60 l-150,0 z',
            stroke: '#00007f',
            fill: '#fffff0'
          };
          config.name = 'path';
          return config;
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
          throw new Error('Bad Step Box State: ' + [JSON.stringify(step), xPos, yPos].join('; '));
      }
    }

    function lookupRegionMultiplier(step, provider, consumer) {
      if (step.domain.region.type === 'direct_shared') {
        return 3.5;
      } else if (step.domain.region.type === 'independent' && step.domain.id === provider.id) {
        return 1;
      } else if (step.domain.region.type === 'independent' && step.domain.id === consumer.id) {
        return 6;
      } else if (step.domain.region.type === 'surrogate' && step.domain.id === provider.id) {
        return 2;
      } else if (step.domain.region.type === 'surrogate' && step.domain.id === consumer.id) {
        return 5;
      } else if (step.domain.region.type === 'direct_leading' && step.domain.id === provider.id) {
        return 3;
      } else if (step.domain.region.type === 'direct_leading' && step.domain.id === consumer.id) {
        return 4;
      } 
      throw new Error('Bad Region State: ' + JSON.stringify(step));
    }

    return {
      render: function (pcn){
        var steps = pcn.steps;
        var provider = pcn.domains[0];
        var consumer = pcn.domains[1];
        var container = utils.createElement('group');

        var store = Object.create(null);
        steps.forEach(function (step) {
          store[step.id] = step;
        });

        var start = utils.find(steps, function(step) {
          return step.predecessors.length === 0;
        });

        var path = findStepPath(start, steps);
        console.log(path.length);
        //TODO: renderPath(container, path, provider, consumer);
        
        return container;
      }
    };
  }
]);
