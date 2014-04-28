(function(){
	'use strict';

	var mongoose = require('mongoose'),
		moment = require('moment'),
		routing = require('../core/routing.js'),
		responseHelper = require('../core/response-helper.js'),
		ObjectId = mongoose.Schema.Types.ObjectId,
	 	schema,
		Activity;


	function setSchema(){
		schema = mongoose.Schema({
			name : { type: String, required: true },
			contact : String,
			startDate : { type: Date, required: true },			
			endDate : { type: Date, required: true, validate : validateEndDate },
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

	function invokeCallback(error, result, callback){
		if (error){
	  		callback(result, error);
		  } 
		  else{
		  	callback(result);
		  }
	}

	function getActivityList(callback){
		Activity.find(function (error, activities) {
			invokeCallback(error, activities, callback);		  
		});		
	}

	function getActivity(id, callback){
		Activity.findById(id, function(error, activity){
			if(!activity){
				error = responseHelper.types.responseCodes.notFound;
			}
			invokeCallback(error, activity, callback);
		});
	}

	function updateActivity(id, postedActivity, callback){
		Activity.update(
			{ _id : id }, 
			postedActivity, 
			function(error){ //function arguments: error, numberAffected, rawResponse
				invokeCallback(error, postedActivity, callback);
			}		  
		);
	}

	function createActivity(postedActivity, callback){
		var activity = new Activity(postedActivity);

		activity.save(function (error, newActivity) {
		  invokeCallback(error, newActivity, callback);	
		});		
	}

	function deleteActivity(id, callback){
		Activity.remove({_id : id}, function(error){
			invokeCallback(error, null, callback);
		});
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