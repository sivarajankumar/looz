(function(){
	'use strict';

	var db = require('../core/db.js'),
		routing = require('../core/routing.js');

	function getActivityList(callback){
		callback([{name:'activity1'}, {name:'activity2'}]);
	}

	function getActivity(id, callback){
		callback({name:'activity1'});
	}

	function updateActivity(activity, callback){
		callback({name:'activity1'});
	}

	function createActivity(activity, callback){
		callback({name:'activity1'});
	}

	function deleteActivity(id, callback){
		callback(id);
	}

	function customStuff(request, response, callback){
		callback({ some : "stuff"});
	}

	exports.register = function(){
		routing.set('activities', {
			getList : getActivityList,
			getItem : getActivity,
			createItem : createActivity,
			updateItem : updateActivity,
			deleteItem : deleteActivity,
			get : {
				custom : customStuff	
			},
			post : {
				custom : customStuff
			}
		});		
	};
})();