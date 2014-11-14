'use strict';

//Diagrams service used to communicate Diagrams REST endpoints
angular.module('diagrams').directive('grapher', ['$document',
  function($document) {
    /**
     * Do other work in _private functions
     */
    function _didWork(val) {
      console.log(val);
    }

    /**
     * Controller to do Scope setup for template
     */
    function controller() {

    }

    /**
     * @scope: Angular scope object.
     * @element: jqLite-wrapped element that this directive matches.
     * @attrs: hash object with key-value pairs of normalized attribute names and their corresponding attribute values.
     */
    function link(scope, element, attrs) {
      _didWork(attrs.pcn);
      scope.pcnString = attrs.pcn;
      element.bind('mouseenter', function () {
        alert('Entered with this value: ' + attrs.enter);
      });
    }

    /**
     * Directive Setup Options
     */
    return {
      restrict: 'E',
      link: link,
      controller: controller,
      // templateUrl: 'sometemplate.html',
      template: '<div><strong>I am here: {{pcnString}}</strong></div>'
    };
  }
]);
