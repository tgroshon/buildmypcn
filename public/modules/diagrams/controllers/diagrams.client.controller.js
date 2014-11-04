'use strict';

// Diagrams controller
angular.module('diagrams').controller('DiagramsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Diagrams', 'Groups',
	function($scope, $stateParams, $location, Authentication, Diagrams, Groups) {
		$scope.authentication = Authentication;

		// Create new Diagram
		$scope.create = function() {
			// Create new Diagram object
			var diagram = new Diagrams ({
				name: this.name,
        group: this.selectedGroup._id
			});

			// Redirect after save
			diagram.$save(function(response) {
				$location.path('diagrams/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Diagram
		$scope.remove = function( diagram ) {
			if ( diagram ) { diagram.$remove();

				for (var i in $scope.diagrams ) {
					if ($scope.diagrams [i] === diagram ) {
						$scope.diagrams.splice(i, 1);
					}
				}
			} else {
				$scope.diagram.$remove(function() {
					$location.path('diagrams');
				});
			}
		};

		// Update existing Diagram
		$scope.update = function() {
			var diagram = $scope.diagram;

			diagram.$update(function() {
				$location.path('diagrams/' + diagram._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

    $scope.setEditedGroup = function() {
      $scope.setEditedGroup = $scope.diagram.group;
    };

		// Find a list of Diagrams
		$scope.find = function() {
			$scope.diagrams = Diagrams.query();
		};

		$scope.getAllGroups = function() {
			$scope.groups = Groups.query();
		};

		// Find existing Diagram
		$scope.findOne = function() {
      $scope.getAllGroups();
			$scope.diagram = Diagrams.get({ 
				diagramId: $stateParams.diagramId
			});
		};
	}
]);
