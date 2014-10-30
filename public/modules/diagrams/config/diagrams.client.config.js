'use strict';

// Configuring the Articles module
angular.module('diagrams').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Diagrams', 'diagrams', 'dropdown', '/diagrams(/create)?');
		Menus.addSubMenuItem('topbar', 'diagrams', 'List Diagrams', 'diagrams');
		Menus.addSubMenuItem('topbar', 'diagrams', 'New Diagram', 'diagrams/create');
	}
]);