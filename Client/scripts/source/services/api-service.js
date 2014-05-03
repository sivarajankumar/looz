(function(angular){
	'use strict';

	var app = angular.module('app');

	app.service('api', ['$resource', function(resource){
		var self = this,
			baseUrl = 'http://127.0.0.1:8090/',
			locationResource,
			activityResource;

		locationResource = resource(baseUrl + 'locations/:id', { id:'@_id'});
		activityResource = resource(baseUrl + 'activities/:id',  { id:'@_id'});

		this.getLocationResource = function(){
			return locationResource;
		};

		this.getActivityResource = function(){
			return activityResource;
		};
		
	}]);

})(angular);