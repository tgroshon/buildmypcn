'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Diagram = mongoose.model('Diagram'),
	_ = require('lodash');

/**
 * Create a Diagram
 */
exports.create = function(req, res) {
	var diagram = new Diagram(req.body);
	diagram.user = req.user;

	diagram.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(diagram);
		}
	});
};

/**
 * Show the current Diagram
 */
exports.read = function(req, res) {
	res.jsonp(req.diagram);
};

/**
 * Update a Diagram
 */
exports.update = function(req, res) {
	var diagram = req.diagram ;

	diagram = _.extend(diagram , req.body);

	diagram.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(diagram);
		}
	});
};

/**
 * Delete an Diagram
 */
exports.delete = function(req, res) {
	var diagram = req.diagram ;

	diagram.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(diagram);
		}
	});
};

/**
 * List of Diagrams
 */
exports.list = function(req, res) { Diagram.find().sort('-created').populate('user', 'displayName').exec(function(err, diagrams) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(diagrams);
		}
	});
};

/**
 * Diagram middleware
 */
exports.diagramByID = function(req, res, next, id) { Diagram.findById(id).populate('user', 'displayName').exec(function(err, diagram) {
		if (err) return next(err);
		if (! diagram) return next(new Error('Failed to load Diagram ' + id));
		req.diagram = diagram ;
		next();
	});
};

/**
 * Diagram authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.diagram.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};