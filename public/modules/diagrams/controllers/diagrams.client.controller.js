'use strict';

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
            {'name': 'process', 'displayedName': '[ ]', 'description': 'Process'},
            {'name': 'decision', 'displayedName': '<>', 'description': 'Decision'},
            {'name': 'wait', 'displayedName': '{ }', 'description': 'Wait'},
            {'name': 'divergent_process', 'displayedName': '( )', 'description': 'Divergent Process'}
        ];

        $scope.regions = [
            {'name': 'independent', 'displayName': 'Independent'},
            {'name': 'surrogate', 'displayName': 'Surrogate'},
            {'name': 'direct_shared', 'displayName': 'Direct Shared'},
            {'name': 'direct_leading', 'displayName': 'Direct Leading'}
        ];

        $scope.predecessorTypes = [
            {'name': 'normal_relationship', 'displayName': 'Normal'},
            {'name': 'loose_temporal_relationship', 'displayName': 'Loose Temporal'}
        ];

        // Smiley face unicode HTML entity: \u263a
        // Frowny face unicode HTML entity: \u2639
        $scope.valueSpecificOptions = [
            {'name': -3, 'displayName': '\u2639\u2639\u2639'},
            {'name': -2, 'displayName': '\u2639\u2639'},
            {'name': -1, 'displayName': '\u2639'},
            {'name': 0, 'displayName': 'O'},
            {'name': 1, 'displayName': '\u263a'},
            {'name': 2, 'displayName': '\u263a\u263a'},
            {'name': 3, 'displayName': '\u263a\u263a\u263a'},
        ];
        $scope.valueGenericOptions = [
            {'name': -3, 'displayName': '-$$$'},
            {'name': -2, 'displayName': '-$$'},
            {'name': -1, 'displayName': '-$'},
            {'name': 0, 'displayName': 'O'},
            {'name': 1, 'displayName': '$'},
            {'name': 2, 'displayName': '$$'},
            {'name': 3, 'displayName': '$$$'},
        ];

        // Create a new, blank PCN object
        $scope.diagram = PCN.initPCN('', '', '');
        $scope.diagram.domains = [PCN.initDomain('', 'Provider'), PCN.initDomain('', 'Customer')];
        $scope.diagram.steps = [PCN.initStep($scope.diagram.domains[1], '', $scope.regions[0].name, null)];

        $scope.lastSelectedDomain = $scope.diagram.domains[1];
        $scope.stepPredecessors = {};

        $scope.addDomain = function () {
            $scope.diagram.domains.push(PCN.initDomain('', ''));
        };

        $scope.addStep = function () {
            var steps = $scope.diagram.steps;
            var newStep = PCN.initStep($scope.lastSelectedDomain, '', $scope.regions[0].name, null);
            if (steps.length > 0) { // assign a predecessor if there is one available
                var lastStep = steps[steps.length - 1];
                newStep.predecessors.push(PCN.initPredecessor(lastStep.id, $scope.predecessorTypes[0].name, ''));
                $scope.stepPredecessors = getStepPredecessorsFromDiagram($scope.diagram);
            }
            steps.push(newStep);
        };

        $scope.deleteStep = function (index) {
            $scope.diagram.steps.splice(index, 1);
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
            $scope.lastSelectedDomain = domain;
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
                    if ($scope.diagrams[i] === diagram) {
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

            diagram.group = $scope.selectedGroup;

            diagram.$update(function () {
                $location.path('diagrams/' + diagram._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.updatePredecessors = function() {
            for (var j = 0; j < $scope.diagram.steps.length; j++) {
                var step = $scope.diagram.steps[j];
                if (typeof $scope.stepPredecessors[step.id] === 'object') {
                    step.predecessors = [];
                    var numPredecessors = Object.keys($scope.stepPredecessors[step.id]).length;
                    for (var i = 0; i < numPredecessors; i++) {
                        var predecessorId = Object.keys($scope.stepPredecessors[step.id])[i];
                        if (!!$scope.stepPredecessors[step.id][predecessorId]) {
                            step.predecessors.push(PCN.initPredecessor(predecessorId, $scope.predecessorTypes[0].name, ''));
                        }
                    }
                }
            }
        };

        $scope.deleteAllPredecessorsForStep = function(step) {
            step.predecessors = [];
            delete $scope.stepPredecessors[step.id];
        };

        $scope.allStepsExceptMe = function(step) {
            var steps = [];
            for (var i = 0; i < $scope.diagram.steps.length; i++) {
                if ($scope.diagram.steps[i].id !== step.id) {
                    steps.push($scope.diagram.steps[i]);
                }
            }
            return steps;
        };

        // Updates each step with the appropriate region with_domain
        $scope.updateStepRegions = function () {
            for (var i = 0; i < $scope.diagram.steps.length; i++) {
                var step = $scope.diagram.steps[i];
                var stepType = step.domain.region.type;
                var owner = $scope.getDomainFromId(step.domain.id);
                var relatedID = (owner.id === $scope.diagram.domains[0].id) ? $scope.diagram.domains[1].id : $scope.diagram.domains[0].id;
                var related = $scope.getDomainFromId(relatedID);
                step.domain = PCN.initStepDomain(owner, stepType, related);
            }
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
                $scope.stepPredecessors = {};
                $scope.lastSelectedDomain = $scope.diagram.domains[1];

                for (var i = 0; i < $scope.groups.length; i++) {
                    if ($scope.groups[i]._id === $scope.diagram.group._id) {
                        $scope.selectedGroup = $scope.groups[i];
                        break;
                    }
                }

                $scope.stepPredecessors = getStepPredecessorsFromDiagram($scope.diagram);
            });
        };

        function getStepPredecessorsFromDiagram (diagram) {
            var stepPredecessors = {};
            for (var i = 0; i < diagram.steps.length; i++) {
                var step = diagram.steps[i];
                var stepObject = {};
                for (var j = 0; j < step.predecessors.length; j++) {
                    var predecessor = step.predecessors[j];
                    stepObject[predecessor.id] = true;
                }
                stepPredecessors[step.id] = stepObject;
            }
            return stepPredecessors;
        }
    }
]);
