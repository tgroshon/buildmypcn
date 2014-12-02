'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','Groups','Diagrams',
	function($scope, Authentication, Groups, Diagrams) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		//Load in data for groups & diagrams
		$scope.find = function() {
			$scope.groups = Groups.query();
			$scope.diagrams = Diagrams.query();
		};
	}
]);
