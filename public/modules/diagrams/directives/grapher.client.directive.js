'use strict';

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

        };
      }
    };
  }
]);
