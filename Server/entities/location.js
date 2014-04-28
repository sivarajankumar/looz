(function(){
	'use strict';

	var mongoose = require('mongoose'),
		routing = require('../core/routing.js'),
		responseHelper = require('../core/response-helper.js'),
	 	schema,
		Location;


	function setSchema(){
		schema = mongoose.Schema({
			name : { type: String, required: true },
			description : String,
		});

		Location = mongoose.model('location', schema);
	}

	function invokeCallback(error, result, callback){
		if (error){
	  		callback(result, error);
		  } 
		  else{
		  	callback(result);
		  }
	}

	function getLocationsList(callback){
		Location.find(function (error, locations) {
			invokeCallback(error, locations, callback);		  
		});		
	}

	function getLocation(id, callback){
		Location.findById(id, function(error, location){
			if(!location){
				error = responseHelper.types.responseCodes.notFound;
			}
			invokeCallback(error, location, callback);
		});
	}

	function updateLocation(id, postedLocation, callback){
		Location.update(
			{ _id : id }, 
			postedLocation, 
			function(error){ //function arguments: error, numberAffected, rawResponse
				invokeCallback(error, postedLocation, callback);
			}		  
		);
	}

	function createLocation(postedLocation, callback){
		var location = new Location(postedLocation);

		location.save(function (error, newLocation) {
		  invokeCallback(error, newLocation, callback);	
		});		
	}

	function deleteLocation(id, callback){
		Location.remove({_id : id}, function(error){
			invokeCallback(error, null, callback);
		});
	}

	setSchema();

	exports.register = function(){
		routing.set('locations', {
			getList : getLocationsList,
			getItem : getLocation,
			createItem : createLocation,
			updateItem : updateLocation,
			deleteItem : deleteLocation
		});		
	};
})();