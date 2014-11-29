/*global $ */
'use strict';

//Diagrams service used to communicate Diagrams REST endpoints
angular.module('diagrams').directive('pcnGrapher', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<object data="/diagrams/{{diagram._id}}/graph" type="image/svg+xml"></object>',
      scope: {
        diagram: '=pcn'
      }
    };
  }
]);

