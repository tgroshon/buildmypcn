'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Group name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	members:{
		type: Array,
		default: []
		//validate:usersOnly
	}
});

GroupSchema.pre('save', function(next){
	var model = this;
	var user = mongoose.model('User');

	user.find({}).or([{'email':{$in: model.members}},{'username':{$in: model.members}}]).exec(function(err, members){
    model.members = members;
    next();
	});
});

mongoose.model('Group', GroupSchema);
