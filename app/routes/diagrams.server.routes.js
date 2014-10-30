'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var diagrams = require('../../app/controllers/diagrams');

	// Diagrams Routes
	app.route('/diagrams')
		.get(diagrams.list)
		.post(users.requiresLogin, diagrams.create);

	app.route('/diagrams/:diagramId')
		.get(diagrams.read)
		.put(users.requiresLogin, diagrams.hasAuthorization, diagrams.update)
		.delete(users.requiresLogin, diagrams.hasAuthorization, diagrams.delete);

	// Finish by binding the Diagram middleware
	app.param('diagramId', diagrams.diagramByID);
};