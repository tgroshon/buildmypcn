'use strict';

// Groups controller
angular.module('groups').controller('GroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groups',
	function($scope, $stateParams, $location, Authentication, Groups ) {
		$scope.authentication = Authentication;

		// Create new Group
		$scope.create = function() {
			// Create new Group object
			var group = new Groups ({
				name: this.name,
				members: this.members
			});
			// Redirect after save
			group.$save(function(response) {
				$scope.name = '';
				$location.path('groups/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Group
		$scope.remove = function( group ) {
			if ( group ) { group.$remove();

				for (var i in $scope.groups ) {
					if ($scope.groups [i] === group ) {
						$scope.groups.splice(i, 1);
					}
				}
			} else {
				$scope.group.$remove(function() {
					$location.path('groups');
				});
			}
		};

	    // Remove a Member from the group
	    $scope.removeMember = function (member) {
	      $scope.group.members = $scope.group.members.filter(function (currentMember) {
	        return currentMember.username !== member.username;
	      });
	    };

		// Update existing Group
		$scope.update = function() {
			var group = $scope.group;

			var members = group.members.map(function (member) {
		        return member.username;
		    });
			group.members = members.concat($scope.addMembers);

			group.$update(function() {
				$location.path('groups/' + group._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Groups
		$scope.find = function() {
			$scope.groups = Groups.query();
		};

		// Find existing Group
		$scope.findOne = function() {
			$scope.group = Groups.get({
				groupId: $stateParams.groupId
			});
		};
	}
]);
