'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'buildmypcn';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('diagrams');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('groups');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Diagrams module
angular.module('diagrams').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Diagrams', 'diagrams', 'dropdown', '/diagrams(/create)?');
		Menus.addSubMenuItem('topbar', 'diagrams', 'List Diagrams', 'diagrams');
		Menus.addSubMenuItem('topbar', 'diagrams', 'New Diagram', 'diagrams/create');
	}
]);

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

'use strict';

//Diagrams service used to communicate Diagrams REST endpoints
angular.module('diagrams').directive('grapher', ['$parse', '$document',
  function($parse, $document) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'modules/diagrams/views/grapher.client.view.html',
      scope: {
        diagram: '=pcn'
      },
      compile: function(tElement, tAttrs) {
        // Process the PCN Data

        return function preLink(scope, element, attrs) {
          var text = createElement('text', {
            fontSize: 22,
            y: 180,
            x: 100
          });
          text.textContent = 'Welcome to the Jungle';
          console.log(text);

          var container = element.find('g.js__grapher-step-container');
          container.append(text);
        };
      }
    };
  }
]);

function createElement(name, attrs) {
  var element = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.keys(attrs).forEach(function (key) {
    element.setAttributeNS(null, 
                           key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
                           attrs[key].toString());
  });
  return element;
}

// function grapherBFG(container, steps) {
//   var regions = {
//     'provider-independent' : 1,
//     'provider-surrogate' : 2,
//     'provider-direct' : 3,
//     'both-direct' : 3.5,
//     'customer-direct' : 4,
//     'customer-surrogate' : 5,
//     'customer-independent' : 6,
//     'r1' : 1,
//     'r2' : 2,
//     'r3' : 3,
//     'r4' : 3.5,
//     'r5' : 4,
//     'r6' : 5,
//     'r7' : 6
//   };
//   var TOP_HEIGHT = 120;
//   var REGION_WIDTH = 180;
//   var x1 = 0; //coordinates of last step
//   var y1 = TOP_HEIGHT + 25 - 60; //step 0 is 100 up
//   var last_step_number = 999; //should not use 999
//   var step_box = null; //always delays steps for layers over lines
//  
//   steps.forEach(function (step, index) {
//     step.number = index + 1; //set number
//     step.diagram = {};
//  
//     var x = 1;
//     if (step.region && regions[step.region] > 0) {
//       x = (regions[step.region] - 1) * REGION_WIDTH + 10;
//     } else {
//       x = 1;
//     }
//  
//     var follows = step.follows;
//     var y = y1 + 100;
//  
//     if (!follows) {
//       y = y1 + 60;
//     } else if (follows == 0 || follows == "start") {
//       y = TOP_HEIGHT + 25;
//     } else if (follows && follows > 0 && steps[follows] && steps[follows].diagram.y) {
//       y = steps[follows].diagram.y + 100;
//     } else {
//       y = y1 + 60;
//     }
// 
//     step.diagram.y = y; //save it so can use later
//  
//     //CONNECTOR LINE
//     var x2 = x + 90; //coordinates of end point
//     var y2 = y + 40;
//     if (follows == 0 || follows == "start") {
//       console.log('First Step ... no connector line');
//     } else {
//       if (x1 > 0) {
//         var x1a = (x1 * 1 + x2 * 1) / 2;
//         var y1a = (y1 * 1 + y2 * 1) / 2;
//  
//         var marker = "markerArrow";
//         var follows = step.follows || '';
//         if (/yes/.test(follows)) {
//           marker = 'markerYes';
//         } else if (/no/.test(follows)) {
//           marker = 'markerNo';
//         }
//         container.append('<polyline stroke="#00007f" marker-mid="url(#' + marker + ')" id="svg_line' + step.number + '" fill="none" stroke-width="2" points="' + x1 + ' ' + y1 + ' ' + x1a + ' ' + y1a + ' ' + x2 + ' ' + y2 + '" se:connector="svg_' + last_step_number + ' svg_' + step.number + '" />');
//       }
//     }
//     x1 = x2;
//     y1 = y2;
//     last_step_number = step.number; //in case we wind up skipping a step
//  
//     //STEP BOX
//     if (step_box)
//       container.append(step_box);
//  
//     var stroke_width = 2;
//     if (step.box_thick)
//       stroke_width = 4;
//     var stroke_dash = 'null';
//     if (step.box_dash)
//       stroke_dash = '5,5';
//  
//     //new step box
//     step_box = $('<g></g>'); //always delays steps for layers over lines
//     if (step.type == "wait") {
//       step_box.append('<path id="svg_' + step.number + '" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="' + stroke_dash + '" stroke-width="' + stroke_width + '" stroke="#00007f" fill="#fffff0" d="m' + x + ',' + y +
//         ' m-5,0 l170,0 l-10,60 l-150,0 z" />');
//     } else if (step.type == "decision") {
//       step_box.append('<path id="svg_' + step.number + '" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="' + stroke_dash + '" stroke-width="' + stroke_width + '" stroke="#00007f" fill="#fffff0" d="m' + x + ',' + y +
//         ' m10,0 l140,0 l10,10 l0,40 l-10,10 l-140,0 l-10,-10 l0,-40 z" />');
//     } else {
//       step_box.append('<rect id="svg_' + step.number + '" height="60" width="' + (REGION_WIDTH - 20) + '" y="' + y + '" x="' + x + '" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="' + stroke_dash + '" stroke-width="' + stroke_width + '" stroke="#00007f" fill="#fffff0" />');
//     }
//  
//     var textx = x * 1 + 5;
//     var texty = y * 1 + 5 + 10;
//     step_box.append(textWrapSVG(step.step, textx, texty, REGION_WIDTH - 30));
//  
//     container.append(step_box); //append the last step box
//   });
//  
//  
//   return container;
// };
// 
// // <svg height="20" width="1000" xmlns="http://www.w3.org/2000/svg" id='textMeasurer'>
// //   <text font-size="large" style="fill:yellow;" x="0" y="18"><tspan id="debugtspan">text</tspan></text>
// // </svg>
// 
// function textWrapSVG(text, textx, texty, width) { 
//   //returns boundary constrained SVG text jQuery object
//   var textObject = $('<text font-family="Serif" font-size="large" fill="#ff0000" text-anchor="left" x="'+textx+'" y="'+texty+'" width="'+width+'" height="80"></text>');
//  
//   var allwords = text.split(' ');
//   allwords.push('~DUMMY~'); //dummy marker to show the end - simplifies
//   var nextword = allwords.shift();
//   var nextwordlen = nextword.length;
//   var line = nextword;  //grab the first word
//   var tspan_element = document.getElementById('debugtspan');
//   tspan_element.innerHTML = line;
//   var dx = 0;
//   var linecount = 0;
//  
//   for(var i=0; i < allwords.length; i++) {
//       nextword = allwords[i];
//       nextwordlen = nextword.length;
//       
//       var len = tspan_element.innerHTML.length;
//       tspan_element.innerHTML = line + " " + nextword;
//       if (tspan_element.getComputedTextLength() > width || nextword == '~DUMMY~') {
//         tspan_element.innerHTML = line;
//         linewidth = tspan_element.getComputedTextLength();
//         linehalf = -Math.round(linewidth/2);
//         if (dx == 0) { //first line
//           textObject.append(('<tspan dx="'+(width/2+linehalf)+'">'+line+'</tspan>')); //tack it on
//         } else {
//           dx += linehalf; //subtract half of the current line
//           textObject.append(('<tspan dx="'+dx+'" dy="20">'+line+'</tspan>')); //tack it on
//         }
//         dx = linehalf;
//           tspan_element.innerHTML = nextword;    // use leftover word
//           line = nextword;  //start next line
//         linecount ++;
//       } else {
//         line += ' ' + nextword;
//       }
//   }
//   textObject.attr('y', texty + 30 - (linecount * 10));
//  
//   return textObject;
// }
//  
// $.fn.xml = function() {
//     return (new XMLSerializer()).serializeToString(this[0]);
// };
//  
// $.fn.DOMRefresh = function() {
//     return $($(this.xml()).replaceAll(this));
// };

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
'use strict';

angular.module('diagrams').factory('PCN', ['uuid',
	function (uuid) {
		return {
      initPCN: function (title, description, author) {
        return {
          'metadata': {
            'title': title,
            'description': description,
            'author': author
          },
          'domains':[],
          'steps':[]
	};
      },

      initStep: function (domain, title, type, relatedDomain) {
        // type = 'independent' | 'surrogate' | 'direct'
        if (!domain) throw new Error('Bad caller: required domain');

        var step = {
          'id': uuid.generate(),
          'title': title,
          'type': 'process',
          'emphasized': false,
          'value_specific': 0,
          'value_generic': 0,
          'predecessors': [],
          'domain': {
            'id': domain.id,
            'region': {
              'type': type,
            },
          },
          'problems': []
		};

        if (relatedDomain)
          step.domain.region.with_domain = relatedDomain.id;

        return step;
      },

      initDomain: function (title, subtitle) {
        return {
          'id': uuid.generate(),
          'title': title,
          'subtitle': subtitle
		};
      }
    };
  }
]);

'use strict';

angular.module('diagrams').factory('uuid', [
  function () {
    return {
      generate: function () {
        var time = new Date().getTime();
        var sixteen = 16;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (match) {
          var remainder = (time + sixteen * Math.random()) % sixteen | 0;
          time = Math.floor(time / sixteen);
          return (match === 'x' ? remainder : remainder & 7 | 8).toString(sixteen);
        });
      }
    };
  }
]);

'use strict';

// Configuring the Articles module
angular.module('groups').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Groups', 'groups', 'dropdown', '/groups(/create)?');
		Menus.addSubMenuItem('topbar', 'groups', 'List Groups', 'groups');
		Menus.addSubMenuItem('topbar', 'groups', 'New Group', 'groups/create');
	}
]);
'use strict';

//Setting up route
angular.module('groups').config(['$stateProvider',
	function($stateProvider) {
		// Groups state routing
		$stateProvider.
		state('listGroups', {
			url: '/groups',
			templateUrl: 'modules/groups/views/list-groups.client.view.html'
		}).
		state('createGroup', {
			url: '/groups/create',
			templateUrl: 'modules/groups/views/create-group.client.view.html'
		}).
		state('viewGroup', {
			url: '/groups/:groupId',
			templateUrl: 'modules/groups/views/view-group.client.view.html'
		}).
		state('editGroup', {
			url: '/groups/:groupId/edit',
			templateUrl: 'modules/groups/views/edit-group.client.view.html'
		});
	}
]);
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

'use strict';

//Groups service used to communicate Groups REST endpoints
angular.module('groups').factory('Groups', ['$resource',
	function($resource) {
		return $resource('groups/:groupId', { groupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invlaid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);