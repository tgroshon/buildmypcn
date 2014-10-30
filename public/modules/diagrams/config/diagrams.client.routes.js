'use strict';

//Setting up route
angular.module('diagrams').config(['$stateProvider',
	function($stateProvider) {
		// Diagrams state routing
		$stateProvider.
		state('listDiagrams', {
			url: '/diagrams',
			templateUrl: 'modules/diagrams/views/list-diagrams.client.view.html'
		}).
		state('createDiagram', {
			url: '/diagrams/create',
			templateUrl: 'modules/diagrams/views/create-diagram.client.view.html'
		}).
		state('viewDiagram', {
			url: '/diagrams/:diagramId',
			templateUrl: 'modules/diagrams/views/view-diagram.client.view.html'
		}).
		state('editDiagram', {
			url: '/diagrams/:diagramId/edit',
			templateUrl: 'modules/diagrams/views/edit-diagram.client.view.html'
		});
	}
]);