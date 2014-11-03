'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

function arrayNotEmpty(val)
{
	return val.length > 0;
}
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

GroupSchema.pre('save',function(next){
	var model = this;
	var numMembers = model.members.length;
	var user = mongoose.model('User');
	user.find({}).or([{'email':{$in: model.members}},{'username':{$in:model.members}}]).exec(function(err, members){
		for(var x = 0; x < members.length; x++)
		{
			model.members[x] = members[x];
		}
		console.log("There are "+members.length+" members in this group");
		if(members.length !== numMembers)
		{
			
			console.log("There has been an error. For some reason there should be max "+numMembers+" members but there are "+members.length+" after for loop execution");
			var error = new Error('All specified members must be registered users of Build My PCN. You may create the group without members and add them later if needed.');
			next(error);
		}
		else
		{
			next();
		}
	});
});

mongoose.model('Group', GroupSchema);