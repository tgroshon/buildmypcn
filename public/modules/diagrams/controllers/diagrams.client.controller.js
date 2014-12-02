'use strict';

angular.module('diagrams').filter('groupTitle', function() {
    return function(group) {
        return group.title || group.subtitle || 'Unknown group';
    };
});

// Diagrams controller
angular.module('diagrams').controller('DiagramsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Diagrams', 'Groups', 'PCN',
    function ($scope, $stateParams, $location, Authentication, Diagrams, Groups, PCN) {

        $scope.authentication = Authentication;

        Groups.query().$promise.then(function (groups) {
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

        $scope.regions = [
            {'name': 'direct_leading', 'displayName': 'Direct Leading'},
            {'name': 'direct_shared', 'displayName': 'Direct Shared'},
            {'name': 'surrogate', 'displayName': 'Surrogate'},
            {'name': 'independent', 'displayName': 'Independent'}
        ];

        $scope.predecessorTypes = [
            {'name': 'normal_relationship', 'displayName': 'Normal'},
            {'name': 'loose_temporal_relationship', 'displayName': 'Loose Temporal'}
        ];

        $scope.valueSpecificOptions = [-3, -2, -1, 0, 1, 2, 3];
        $scope.valueGenericOptions = [-3, -2, -1, 0, 1, 2, 3];

        // Create a new, blank PCN object
        $scope.diagram = PCN.initPCN('', '', '');
        $scope.diagram.domains = [PCN.initDomain('', 'Provider'), PCN.initDomain('', 'Customer')];
        $scope.diagram.steps = [PCN.initStep($scope.diagram.domains[1], '', '', null)];

        $scope.addDomain = function () {
            $scope.diagram.domains.push(PCN.initDomain('', ''));
        };

        $scope.addStep = function () {
            $scope.diagram.steps.push(PCN.initStep($scope.diagram.domains[0], '', '', null));
            setPredecessors($scope.diagram);
        };

        $scope.deleteStep = function (index) {
            $scope.diagram.steps.splice(index, 1);
            setPredecessors($scope.diagram);
        };

        $scope.getDomainFromId = function (domainId) {
            for (var i = 0; i < $scope.diagram.domains.length; i++) {
                if ($scope.diagram.domains[i].id === domainId) {
                    return $scope.diagram.domains[i];
                }
            }
        };

        $scope.changeStepDomain = function (step, domain) {
            step.domain.id = domain.id;
        };

        // Create new Diagram
        $scope.create = function () {
            // Create new Diagram object
            var diagram = new Diagrams({
                metadata: {
                    title: this.diagram.metadata.title,
                    description: this.diagram.metadata.description,
                    author: $scope.authentication.user.displayName
                },
                group: this.selectedGroup._id,
                domains: this.diagram.domains,
                steps: this.diagram.steps
            });

            setRegions(diagram);

            // Redirect after save
            diagram.$save(function (response) {
                $location.path('diagrams/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.description = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Diagram
        $scope.remove = function (diagram) {
            if (diagram) {
                diagram.$remove();

                for (var i in $scope.diagrams) {
                    if ($scope.diagrams [i] === diagram) {
                        $scope.diagrams.splice(i, 1);
                    }
                }
            } else {
                $scope.diagram.$remove(function () {
                    $location.path('diagrams');
                });
            }
        };

        // Update existing Diagram
        $scope.update = function () {
            var diagram = $scope.diagram;

            setPredecessors(diagram);
            setRegions(diagram);

            diagram.group = $scope.selectedGroup;

            diagram.$update(function () {
                $location.path('diagrams/' + diagram._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        function setPredecessors(diagram) {
            for (var i = 1; i < diagram.steps.length; i++) {
                var step = diagram.steps[i];
                var previousStep = diagram.steps[i - 1];
                step.predecessors = [PCN.initPredecessor(previousStep.id, $scope.predecessorTypes[0].displayName, previousStep.title)];
            }
        }

        function setRegions(diagram) {
            for (var i = 0; i < diagram.steps.length; i++) {
                var step = diagram.steps[i];
                var name = step.selectedRegion.name;
                step.domain.region = { type: name, with_domain: diagram.domains[0].id === step.domain.id ? diagram.domains[1].id : diagram.domains[0].id };
            }
        }

        $scope.setEditedGroup = function () {
            $scope.setEditedGroup = $scope.diagram.group;
        };

        // Find a list of Diagrams
        $scope.find = function () {
            $scope.diagrams = Diagrams.query();
        };

        // Find existing Diagram
        $scope.findOne = function () {
            $scope.groups = Groups.query();
            var promise = Diagrams.get({
                diagramId: $stateParams.diagramId
            });

            promise.$promise.then(function (diagram) {
                $scope.diagram = diagram;
                $scope.selectedGroup = null;

                var i;

                for (i = 0; i < $scope.groups.length; i++) {
                    if ($scope.groups[i]._id === $scope.diagram.group._id) {
                        $scope.selectedGroup = $scope.groups[i];
                        break;
                    }
                }

                for (i = 0; i < $scope.diagram.steps.length; i++) {
                    var step = $scope.diagram.steps[i];
                    for (var j = 0; j < $scope.diagram.domains.length; j++) {
                        if (step.domain.id === $scope.diagram.domains[j].id) {
                            step.domain = $scope.diagram.domains[j];
                            break;
                        }
                    }

                    for (var j = 0; j < $scope.regions.length; j++) {
                        if (step.domain.region.type === $scope.regions[j].name) {
                            step.selectedRegion = $scope.regions[j];
                            break;
                        }
                    }
                }
            });
        };
    }
]);
