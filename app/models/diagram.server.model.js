'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Diagram', DiagramSchema);