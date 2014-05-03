(function(angular, $){
	'use strict';

	var app = angular.module('app');


	app.controller('appCTRL', ['$scope', 'api', function($scope, api){
		var locationResource = api.getLocationResource();
		$scope.locations = locationResource.query();
	}]);

})(angular, jQuery);