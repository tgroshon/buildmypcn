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
    metadata: {
        title: {
            type: String,
            default: '',
            required: 'Please give the diagram a title',
            trim: true
        },
        description: {
            type: String,
            default: '',
            trim: true
        },
        author: {
            type: String,
            default: ''
        }
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

/**
 * Retrieve group objects based on IDs in groups
 * Pass callback cb to respond when data comes back
 */
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
