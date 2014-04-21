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
			serverError : 500 
		},
		headers = {
			contentType : 'Content-Type'
		};

	function sendNotFound(response, message){
		response.setHeader(headers.contentType, contentTypes.text);
		response.statusCode = responseCodes.notFound;
		response.end(message);
	}

	function sendOk(response, retrunValue){
		response.setHeader(headers.contentType, contentTypes.json);
		response.statusCode = responseCodes.ok;
		response.end(retrunValue);
	}

	function sendError(response, message){
		response.setHeader(headers.contentType, contentTypes.text);
		response.statusCode = responseCodes.serverError;
		response.end(message);
	}

	exports.send = {
		notFound 	: sendNotFound,
		ok			: sendOk,
		error 		: sendError
	};
})();