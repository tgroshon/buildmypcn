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

	user
    .find()
    .or([{'email':{$in: model.members}},{'username':{$in: model.members}}])
    .select('email username displayName firstName lastName')
    .exec(function(err, members){
      model.members = members;
      next();
    });
});

GroupSchema.statics.findByUser = function (user, cb) {
  this.find()
    .sort('-created')
    .or([{'user': user._id}, {'members._id': {$in: [user._id]}}])
    .populate('user', 'displayName').exec(function(err, groups) {
      if (err) return cb(err);
      cb(null, groups);
    });
};

mongoose.model('Group', GroupSchema);
