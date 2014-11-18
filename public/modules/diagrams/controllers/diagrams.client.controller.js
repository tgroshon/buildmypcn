'use strict';

// Diagrams controller
angular.module('diagrams').controller('DiagramsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Diagrams', 'Groups', 'PCN',
	function($scope, $stateParams, $location, Authentication, Diagrams, Groups, PCN) {
		$scope.authentication = Authentication;
		Groups.query().$promise.then(function(groups) {
			if (groups.length > 0) {
				$scope.selectedGroup = groups[0];
			}
			$scope.groups = groups;
		});
		$scope.stepTypes = [
			{'name': 'process', 'displayedName': 'Process'},
			{'name': 'decision', 'displayedName': 'Decision'},
			{'name': 'wait', 'displayedName': 'Wait'},
			{'name': 'divergent_process', 'displayedName': 'Divergent Process'}
		];
		$scope.valueSpecificOptions = [-3, -2, -1, 0, 1, 2, 3];
		$scope.valueGenericOptions = [-3, -2, -1, 0, 1, 2, 3];

		// Create a new, blank PCN object
		$scope.pcn = PCN.initPCN('', '', '');
		$scope.pcn.domains = [PCN.initDomain('', 'Provider'), PCN.initDomain('', 'Customer')];
		$scope.pcn.steps = [PCN.initStep($scope.pcn.domains[0], '', '', null)];

		$scope.addDomain = function() {
			$scope.pcn.domains.push(PCN.initDomain('', ''));
		};
		$scope.addStep = function() {
			$scope.pcn.steps.push(PCN.initStep($scope.pcn.domains[0], '', '', null));
		};

		// Create new Diagram
		$scope.create = function() {
			// Create new Diagram object
			var diagram = new Diagrams ({
        title: this.pcn.metadata.title,
        group: this.selectedGroup._id,
				description: this.pcn.metadata.description,
				domains: this.pcn.domains,
				steps: this.pcn.steps
			});

			// Redirect after save
			diagram.$save(function(response) {
				$location.path('diagrams/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.description = '';
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
			var diagram = $scope.pcn;
            diagram.group = $scope.selectedGroup;
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

		// Find existing Diagram
		$scope.findOne = function() {
			$scope.groups = Groups.query();
			var promise = Diagrams.get({
				diagramId: $stateParams.diagramId
			});

      promise.$promise.then(function(diagram) {
         $scope.diagram = diagram;
         $scope.selectedGroup = null;

         for (var i = 0; i < $scope.groups.length; i++) {
           if ($scope.groups[i]._id === $scope.diagram.group._id) {
             $scope.selectedGroup = $scope.groups[i];
             break;
           }
         }
      });
		};
	}
]);
