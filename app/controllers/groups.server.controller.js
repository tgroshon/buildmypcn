'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Group = mongoose.model('Group'),
	_ = require('lodash');

/**
 * Create a Group
 */
exports.create = function(req, res) {
	var group = new Group(req.body);

  group.user = req.user;

  group.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(group);
    }
  });
};

/**
 * Show the current Group
 */
exports.read = function(req, res) {
	res.jsonp(req.group);
};

/**
 * Update a Group
 */
exports.update = function(req, res) {
	var group = req.group;

	group = _.extend(group, req.body);

	group.save(function(err, model) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
    }
    res.jsonp(model);
	});
};

/**
 * Delete an Group
 */
exports.delete = function(req, res) {
	var group = req.group ;

	group.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(group);
		}
	});
};

/**
 * List of Groups you own or are a member
 */
exports.list = function(req, res) {
  Group.findByUser(req.user, function(err, groups) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		}
    res.jsonp(groups);
	});
};

/**
 * Group middleware
 */
exports.groupByID = function(req, res, next, id) {
  Group.findById(id).populate('user', 'displayName').exec(function(err, group) {
		if (err) return next(err);
		if (!group) return next(new Error('Failed to load Group ' + id));
		req.group = group;
		next();
	});
};

/**
 * Group authorization middleware
 * Only the creator
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.group.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
