'use strict';

//Diagrams service used to communicate Diagrams REST endpoints
angular.module('diagrams').factory('Diagrams', ['$resource',
	function($resource) {
		return $resource('diagrams/:diagramId', { diagramId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);