(function(){
	'use strict';

	var _ = require('lodash-node'),
		responseHelper = require('./response-helper.js'),
		requestHelper = require('./request-helper.js'),	
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

		/**
		 * This is the 'callback' function that is passed to the entity during routing. The entity
		 * should use this function to return successfull result or throw errors.
		 *
		 * To respond with successfull, just send 'result' or call the 'callback' without
		 * parameters (if you have nothing to send).
		 * 
		 * To respond with errors, pass error message in the 'result' and error code for the error.
		 * You can pass 'true' to the error instead of code to send back 500 server error.
		 */
		function callback(result, error){
			//TODO: further filter things according to query string or headers
			if(!error){
				responseHelper.send.ok(response, result);
			}
			else{
				if(responseHelper.isValidCode(error) === false){
					error = responseHelper.types.responseCodes.serverError;			
				}
				responseHelper.send.byCode(response, error, result);
			}
		}

		function invokeCustomAction(method, action){
			switch(method){
				case 'GET':
				case 'DELETE':
					action(request, response, callback);
					break;
				case 'POST':
				case 'PUT':
					action({}, request, response, callback);
					break;
			}
		}

		function invokeItemCrudAction(method){
			var action,
				key,
				content;

			switch(method){
				case 'GET':
					action = 'getItem';
					content = request.routeKeys[1];
					break;				
				case 'PUT':
					action = 'updateItem';
					key = request.routeKeys[1];
					content = request.content;
					break;
				case 'DELETE':
					action = 'deleteItem';
					content = request.routeKeys[1];
					break;
			}
			if(canInvoke(action)){
				if(!key){
					routeHandlers[action](content, callback);
				}
				else{
					routeHandlers[action](key, content, callback);
				}
			}
			else{
				responseHelper.send.notImplemented(response);
			}
		}

		function invokeListCrudAction(method){
			var action,				
				content;

			switch(method){
				case 'GET':
					action = 'getList';
					break;
				case 'POST':
					action = 'createItem';
					content = request.content; 
					break;
				case 'PUT':
					action = 'updateList';
					content = request.content;
					break;
				case 'DELETE':
					action = 'deleteList';
					break;
			}
			if(canInvoke(action)){
				if(_.isUndefined(content) === false){
					routeHandlers[action](content, callback);
				}
				else{
					routeHandlers[action](callback);
				}
			}
			else{
				responseHelper.send.notImplemented(response);
			}
		}

		if(routeLength === 1){
			invokeListCrudAction(request.method);
		}
		else{
			customAction = findActionByMethod(request.method, request.routeKeys[1], routeHandlers);
			if(customAction !== null){
				invokeCustomAction(request.method, customAction);
			}
			else{
				invokeItemCrudAction(request.method);
			}			
		}
	}

	function startRouting(request, response){
		var routeKey,
			routeHandlers;

		//You can use 'default key' to register route handlers for the domain, i.e 'http://my.domain.com/'
		routeKey = request.routeKeys.length > 0 ? request.routeKeys[0] : 'default key';  
		routeHandlers = routs.hasOwnProperty(routeKey) ? routs[routeKey] : null;
		if(_.isNull(routeHandlers) === false && _.isUndefined(routeHandlers) === false){
			handleRoute(request, response, routeHandlers);
		}
		else{
			responseHelper.send.badRequest(response, 'Unable to do that thing you wanted. Sorry.');
		}
	}

	/* 
	 * Allows entities to register thier function to the routing system.
	 * 'key' is the first argument of the url, i.e. http://my.domain.com/[key]
	 * and 'routeHandlers' is a mapping object that allows the entity to map functions to
	 * requests under the provided key. routeHandlers should look like this:
	 * {
	 *		getList : function(callback), 					//when calling http://my.domain.com/[key] with GET
	 *		createItem : function(entity, callback), 		//when calling http://my.domain.com/[key] with POST
	 *		updateList : function(id, entities, callback), 	//when calling http://my.domain.com/[key] with PUT
	 *		deleteList : function(id, callback), 			//when calling http://my.domain.com/[key] with DELETE
	 *		getItem	: function(id, callback), 				//when calling http://my.domain.com/[key]/:id with GET
	 *		updateItem : function(entity, callback), 		//when calling http://my.domain.com/[key]/:id with PUT
	 *		deleteItem : function(id, callback), 			//when calling http://my.domain.com/[key]/:id with DELETE
	 *		get : {
	 *			[some key] : function(request, response, callback)	//when calling http://my.domain.com/[key]/:[some key] with GET
	 *		},
	 *		delete : {
	 *			[some key] : function(request, response, callback)	//when calling http://my.domain.com/[key]/:[some key] with DELETE
	 *		},
	 *		post : {
	 *			[some key] : function(body, request, response, callback) //when calling http://my.domain.com/[key]/:[some key] with POST
	 *		}
	 *		put : {
	 *			[some key] : function(body, request, response, callback) //when calling http://my.domain.com/[key]/:[some key] with PUT
	 *		}
	 * }
	 * 
	 * The first items names (getItem, deleteItem, etc') are hard coded names. You could ignore them by 
	 * calling the get, post, put or delete to get more verbouse API like http://domain.com/users/create/:id 
	 * or to add non-crud functionality.
	 *
	 * The callback is used by the entity to return successfull result or throw an error. See callback() mehtod.
	 * 
	 */
	exports.set = function(key, routeHandlers){
		routs[key] = routeHandlers;
	};

	exports.route = function(request, response){
		requestHelper.get(request, response, startRouting);
	};

})();