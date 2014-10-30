'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var groups = require('../../app/controllers/groups');

	// Groups Routes
	app.route('/groups')
		.get(groups.list)
		.post(users.requiresLogin, groups.create);

	app.route('/groups/:groupId')
		.get(groups.read)
		.put(users.requiresLogin, groups.hasAuthorization, groups.update)
		.delete(users.requiresLogin, groups.hasAuthorization, groups.delete);

	// Finish by binding the Group middleware
	app.param('groupId', groups.groupByID);
};