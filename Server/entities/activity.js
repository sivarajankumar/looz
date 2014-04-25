(function(){
	'use strict';

	var mongoose = require('mongoose'),
		moment = require('moment'),
		routing = require('../core/routing.js'),
		ObjectId = mongoose.Schema.Types.ObjectId,
	 	schema,
		Activity;


	function setSchema(){
		schema = mongoose.Schema({
			name : { type: String, required: true },
			contact : String,
			startDate : { type: Date, required: true },			
			enddDate : { type: Date, required: true, validate : validateEndDate },
			comments : String,
			location : ObjectId
		});

		Activity = mongoose.model('activity', schema);
	}

	function validateEndDate(endDate){
		 var start = moment(this.startDate),
		 	 end= moment(endDate),
		 	 isValid = end.isAfter(start) || end.isSame(start);

		 return isValid;
	}

	function getActivityList(callback){
		Activity.find(function (err, activities) {
		  if (err){
		  	callback(err, true);
		  }
		  else{
		  	callback(activities);
		  }
		});		
	}

	function getActivity(id, callback){
		callback({name:'activity1'});
	}

	function updateActivity(activity, callback){
		callback({name:'activity1 updated'});
	}

	function createActivity(postedActivity, callback){
		var activity = new Activity(postedActivity);

		activity.save(function (err, newActivity) {
		  if (err){
	  		callback(err, true);
		  } 
		  else{
		  	callback(newActivity);
		  }
		});		
	}

	function deleteActivity(id, callback){
		callback(id);
	}

	function customGetStuff(request, response, callback){
		callback({ some : 'stuff'});
	}

	function customPostStuff(body, request, response, callback){
		callback({ some : 'stuff'});
	}

	setSchema();

	exports.register = function(){
		routing.set('activities', {
			getList : getActivityList,
			getItem : getActivity,
			createItem : createActivity,
			updateItem : updateActivity,
			deleteItem : deleteActivity,
			get : {
				custom : customGetStuff	
			},
			post : {
				custom : customPostStuff
			}
		});		
	};
})();