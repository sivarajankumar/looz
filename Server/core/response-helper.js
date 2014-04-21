(function(){
	'use strict';

	var contentTypes = {
			html : 'text/html',
			json : 'application/json',
			text : 'text/plain'
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
		sendSimpleMessage(response, message, responseCodes.serverError);
	}

	function sendBadRequest(response, message){
		sendSimpleMessage(response, message, responseCodes.badRequest);
	}

	function sendNotImplemented(response, message){
		sendSimpleMessage(response, message, responseCodes.notImplemented);
	}

	exports.send = {
		notFound 		: sendNotFound,
		ok				: sendOk,
		error 			: sendError,
		badRequest 		: sendBadRequest,
		notImplemented 	: sendNotImplemented
	};
})();