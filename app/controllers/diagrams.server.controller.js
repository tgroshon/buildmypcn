'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var errorHandler = require('./errors');
var Diagram = mongoose.model('Diagram');
var Group = mongoose.model('Group');
var _ = require('lodash');
var chartBuilder = require('pcnchart');

/**
 *
 */
exports.graph = function(req, res) {
  var diagram = req.diagram;

  // TODO: Remove this test data
  diagram = require('../fixtures/cold-stone.json');

  res.set({
    'Content-Type': 'image/svg+xml',
    'X-Frame-Options': 'SAMEORIGIN'
  });
  res.send(chartBuilder(diagram));
};

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
exports.list = function(req, res) {
  Group.findByUser(req.user, function (err, groups) {
    if (err) {
      return res.status(400).send({message: errorHandler.getErrorMessage(err)});
    }
    Diagram.findByGroups(groups, function (err, diagrams) {
      if (err) {
        return res.status(400).send({message: errorHandler.getErrorMessage(err)});
      }
      res.jsonp(diagrams);
    });
  });
};

/**
 * Diagram middleware
 */
exports.diagramByID = function(req, res, next, id) {
  Diagram.findById(id).populate('group').exec(function(err, diagram) {
		if (err) return next(err);
		if (!diagram) return next(new Error('Failed to load Diagram ' + id));
		req.diagram = diagram;
		next();
	});
};

/**
 * Diagram authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (!req.diagram.group)
    return res.status(500).send('Misconfigured Diagram');

  var userIsGroupOwner = req.user._id.equals(req.diagram.group.user);
  var userIsGroupMember = req.diagram.group.members.some(function (member) {
    return req.user._id.equals(member._id);
  });
  
  if (userIsGroupOwner || userIsGroupMember)
    return next();
  else
    return res.status(403).send('User Not Authorized via Group for this diagram');
};
