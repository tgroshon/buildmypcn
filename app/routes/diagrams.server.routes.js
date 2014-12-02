'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var diagrams = require('../../app/controllers/diagrams');

	// Diagrams Routes
	app.route('/diagrams')
		.get(users.requiresLogin, diagrams.list)
		.post(users.requiresLogin, diagrams.create);

	app.route('/diagrams/:diagramId/graph')
	    .get(diagrams.graph);

	app.route('/diagrams/:diagramId/download')
	    .get(diagrams.download);

	app.route('/diagrams/:diagramId')
		.get(users.requiresLogin, diagrams.hasAuthorization, diagrams.read)
		.put(users.requiresLogin, diagrams.hasAuthorization, diagrams.update)
		.delete(users.requiresLogin, diagrams.hasAuthorization, diagrams.delete);

	app.route('/diagrams/:diagramId/pdf')
		.get(users.requiresLogin, diagrams.hasAuthorization, diagrams.generatePdf);

	// Finish by binding the Diagram middleware
	app.param('diagramId', diagrams.diagramByID);
};
