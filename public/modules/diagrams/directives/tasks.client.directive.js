'use strict';

//Diagrams service used to communicate Diagrams REST endpoints
angular.module('diagrams').directive('tasks', ['$document',
    function() {
        return {
            restrict: 'E',
            replace:true,
            link: function(){},
            templateUrl: '/modules/diagrams/views/tasks-diagram.client.partial-view.html'
        };
    }
]);
