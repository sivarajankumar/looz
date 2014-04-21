(function(){
	'use strict';

	var _ = require('lodash-node'),
		responseHelper = require('./response-helper.js'),
		routs = {};	

	function handleRoute(request, response, routeHandlers){
		responseHelper.send.ok(response);
	}	

	exports.set = function(key, routeHandlers){
		routs[key] = routeHandlers;
	};

	exports.route = function(request, response){
		var routeKey,
			routeHandlers;

		routeHandlers = _.find(routeKey);
		if(_.isNull(routeHandlers) === false && _.isUndefined(routeHandlers) === false){
			handleRoute(request, response, routeHandlers);
		}
		else{
			responseHelper.send.notFound(response, 'Unable to find that thing you wanted. Sorry.');
		}
	};

})();