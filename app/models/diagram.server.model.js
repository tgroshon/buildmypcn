'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Diagram Schema
 */
var DiagramSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please give the diagram a title',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please give the diagram a description',
		trim: true
	},
	domains: {
		type: Array
	},
	created: {
		type: Date,
		default: Date.now
	},
	group: {
		type: Schema.ObjectId,
		ref: 'Group'
	},
	steps: {
		type: Array
	}
});

DiagramSchema.statics.findByGroups = function (groups, cb) {
  if (!groups) return cb();
  var groupIds = groups.map(function (group) { return group._id; });

  this.find({'group': { $in: groupIds }})
    .sort('-created')
    .populate('group')
    .exec(function(err, diagrams) {
      if (err) return cb(err);
      cb(null, diagrams);
    });
};

mongoose.model('Diagram', DiagramSchema);
