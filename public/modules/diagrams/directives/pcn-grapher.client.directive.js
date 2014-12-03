/*global $ */
'use strict';

//Diagrams service used to communicate Diagrams REST endpoints
angular.module('diagrams').directive('pcnGrapher', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div></div>',
      scope: {
        diagramId: '@'
      },
      link: function(scope, element, attrs) {
        attrs.$observe('diagramId', function(value){
          if (value) {
            element.html('<object class="pcn-grapher-directive" data="/diagrams/' + value + '/graph" type="image/svg+xml"></object>');
          }
        });
      }
    };
  }
]);

