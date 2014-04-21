(function(){
	'use strict';

	var _ = require('lodash-node'),
		responseHelper = require('./response-helper.js'),
		urlHelper = require('url'),
		routs = {};	

	/* Look inside the routeHandlers for actions registered to methods, for example 
	 * routing.set('entity', { 
	 *    get : { do : someFunction}, 
	 *    post : { act : someOtherFunction}
	 * });
	 * If calling 'http://my.domain.com/entity/act' with 'POST' then the someOtherFunction will run.
	 * The actions are functions with signature (request, response, callback) for 'GET' and 'DELETE',
	 * and (body, request, response, callback) for 'POST' and 'PUT'.
	 * To return result, either use the callback or use 'response-helper' directly.
	 */ 
	function findActionByMethod(method, action, routeHandlers){
		var result = null,
			handlerMethodObject;

		function verifyAndCompare(obj, property, value, typeFunction){
			var isOk = 	obj.hasOwnProperty(property) && 
						property.toLowerCase() === value.toLowerCase() &&
						typeFunction(obj[property]) === true;
			return isOk;
		}

		function getMethodObject(){
			var methodObject = null,
				property;

			for(property in routeHandlers){
				if(verifyAndCompare(routeHandlers, property, method, _.isObject)){
					methodObject = routeHandlers[property];
					break;
				}
			}
			return methodObject;
		}

		function getAction(methodObject, action){
			var actionFunction = null,
				property;

			for(property in methodObject){
				if(verifyAndCompare(methodObject, property, action, _.isFunction)){
					actionFunction = methodObject[property];
					break;
				}
			}
			return actionFunction;
		}

		handlerMethodObject = getMethodObject();		
		if(handlerMethodObject !== null){
			result = getAction(handlerMethodObject, action);
		}
		
		return result;
	}

	/* 
	 * Route handlers is an object with methods that will be called according to the incomming request.
	 * The methods should invoke the callback function passed to them.
	 */ 
	function handleRoute(request, response, routeHandlers){
		var routeLength = request.routeKeys.length,
			customAction;


		function canInvoke(functionName){			
			return _.has(routeHandlers, functionName) && _.isFunction(routeHandlers[functionName]);		
		}

		function postProccess(result){
			//TODO: further filter things according to query string or headers
			responseHelper.send.ok(response, result);
		}

		function invokeCustomAction(method, action){
			switch(method){
				case 'GET':
				case 'DELETE':
					action(request, response, postProccess);
					break;
				case 'POST':
				case 'PUT':
					action({}, request, response, postProccess);
					break;
			}
		}

		function invokeCrudAction(method){
			var action,
				content;

			switch(method){
				case 'GET':
					action = 'getItem';
					content = request.routeKeys[1];
					break;
				case 'PUT':
					action = 'createItem';
					content = null; // Get request body
					break;
				case 'POST':
					action = 'updateItem';
					content = null; // Get request body
					break;
				case 'DELETE':
					action = 'deleteItem';
					content = request.routeKeys[1];
					break;
			}
			if(canInvoke(action)){
				routeHandlers[action](content, postProccess);
			}
			else{
				responseHelper.send.notImplemented(response);
			}
		}

		if(routeLength === 1){
			if(canInvoke('getList')){
				routeHandlers.getList(postProccess);
			}
			else{
				responseHelper.send.notImplemented(response);
			}
		}
		else{
			customAction = findActionByMethod(request.method, request.routeKeys[1], routeHandlers);
			if(customAction !== null){
				invokeCustomAction(request.method, customAction);
			}
			else{
				invokeCrudAction(request.method);
			}			
		}
	}	

	exports.set = function(key, routeHandlers){
		routs[key] = routeHandlers;
	};

	exports.route = function(request, response){
		var routeKey,
			routeHandlers;

		// extend request to hold parsed URL
		request.paresdUrl = urlHelper.parse(request.url, true);
		request.routeKeys = request.paresdUrl.pathname.split('/');
		request.routeKeys = _.without(request.routeKeys, '');
		
		//You can use 'default key' to register route handlers for the domain, i.e 'http://my.domain.com/'
		routeKey = request.routeKeys.length > 0 ? request.routeKeys[0] : 'default key';  
		routeHandlers = routs.hasOwnProperty(routeKey) ? routs[routeKey] : null;
		if(_.isNull(routeHandlers) === false && _.isUndefined(routeHandlers) === false){
			handleRoute(request, response, routeHandlers);
		}
		else{
			responseHelper.send.badRequest(response, 'Unable to do that thing you wanted. Sorry.');
		}
	};

})();