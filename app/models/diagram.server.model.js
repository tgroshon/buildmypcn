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
	name: {
		type: String,
		default: '',
		required: 'Please fill Diagram name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	group: {
		type: Schema.ObjectId,
		ref: 'Group'
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
