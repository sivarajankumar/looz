(function(){
	'use strict';

	var mongoose = require('mongoose'),
		contentTypes = {
			html : 'text/html',
			json : 'application/json',
			text : 'text/plain',
			form : 'application/x-www-form-urlencoded'
		},
		responseCodes = {
			ok : 200,
			forbidden : 403,
			notFound : 404,
			badRequest : 400,
			serverError : 500,
			notImplemented : 501
		},
		headers = {
			contentType : 'Content-Type'
		};

	function sendSimpleMessage(response, message, code){
		response.setHeader(headers.contentType, contentTypes.text);
		response.statusCode = code;	
		response.end(message);
	}

	function sendNotFound(response, message){
		sendSimpleMessage(response, message, responseCodes.notFound);
	}

	function sendOk(response, retrunValue){
		response.setHeader(headers.contentType, contentTypes.json);
		response.statusCode = responseCodes.ok;
		response.end(JSON.stringify(retrunValue));
	}

	function sendError(response, message){
		message = parseError(message);
		sendSimpleMessage(response, message, responseCodes.serverError);
	}

	function sendBadRequest(response, message){
		message = parseError(message);
		sendSimpleMessage(response, message, responseCodes.badRequest);
	}

	function sendNotImplemented(response, message){
		sendSimpleMessage(response, message, responseCodes.notImplemented);
	}

	function sendForbidden(response, message){
		sendSimpleMessage(response, message, responseCodes.forbidden);
	}

	function sendErrorByCode(response, code, result){
		switch(code){
			case responseCodes.ok :
				sendOk(response, result);
				break;
			case responseCodes.forbidden :
				sendForbidden(response, result);
				break;
			case responseCodes.notFound :
				sendNotFound(response, result);
				break;
			case responseCodes.badRequest :
				sendBadRequest(response, result);
				break;
			case responseCodes.serverError :
				sendError(response, result);
				break; 
			case responseCodes.notImplemented :
				sendNotImplemented(response, result);
				break; 
		}
	}

	function isValidCode(code){
		var result = false,
			codeKey;

		if('number' === typeof code){
			for(codeKey in responseCodes){
				if(responseCodes.hasOwnProperty(codeKey) && responseCodes[codeKey] === code){
					result = true;
					break;
				}
			}
		}
		return result;
	}

	function parseError(error){
		var validationError = mongoose.Error.ValidationError,
			validatorError = mongoose.Error.ValidatorError,
			result = {};

		if('string' === typeof error){
			result = { generalError : error };
		}
		else if(error instanceof validationError){
			for(var e in error.errors){
				if(error.errors[e] instanceof validatorError){
					result[e] = error.errors[e].message;
				}
			}			
		}
		return JSON.stringify(result);
	}

	exports.send = {
		notFound 		: sendNotFound,
		ok				: sendOk,
		error 			: sendError,
		badRequest 		: sendBadRequest,
		notImplemented 	: sendNotImplemented,
		forbidden 		: sendForbidden,
		byCode			: sendErrorByCode
	};

	exports.isValidCode = isValidCode;

	exports.types = {
		contentTypes : contentTypes,
		responseCodes : responseCodes,
		headers : headers
	};
})();