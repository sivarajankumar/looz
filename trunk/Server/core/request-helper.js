(function(){
	'use strict';

	var _ = require('lodash-node'),
		settings = require('./settings.js'),
		urlHelper = require('url'),
		responseHelper = require('./response-helper.js'),
		querystring = require('querystring'),
		types = responseHelper.types;

	function extendUrlAndRouteKeys(request){
		// extend request to hold parsed URL
		request.paresdUrl = urlHelper.parse(request.url, true);
		request.routeKeys = request.paresdUrl.pathname.split('/');
		request.routeKeys = _.without(request.routeKeys, '');
		return request;
	}

	function allowCrossDomain(response){
		response.setHeader(types.headers.allowOrigin, settings.clientDomain);
		return response;
	}

	exports.get = function(request, response, callback){
		var requestBody ='',
			contentType = request.headers[types.headers.contentType.toLowerCase()];

		request = extendUrlAndRouteKeys(request);
		response = allowCrossDomain(response);

		if(request.method === 'POST' || request.method === 'PUT'){
			request.on('data', function(chunk) {
		     //TODO: handle data other than string
		      requestBody += chunk.toString();
		    });
		    
		    request.on('end', function() {
		    	//TODO: handle try/catch

				// parse the received body data		      
				if(contentType === types.contentTypes.form){
					request.content = querystring.parse(requestBody);
				}
				else if(contentType === types.contentTypes.json){
					try{
						request.content = JSON.parse(requestBody);		
					}
					catch(e){
						responseHelper.send.error(response, 'Unable to parse JSON. ' + e.message);
						return false;
					}			
				}
				callback(request, response);
		    });
		}
		else if(request.method === 'GET' || request.method === 'DELETE'){
			request.content = null;
			callback(request, response);
		}
		else {
			responseHelper.send.badRequest(response, 'Metod "' + request.method + '" is unsupported.');
		}
	};
})();