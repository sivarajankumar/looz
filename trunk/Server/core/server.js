(function(){
	'use strict';

	var http = require('http');

	exports.start = function(settings, routing){
		var server = http.createServer(function (req, res) {
			routing.route(req, res);
		});
		server.listen(settings.port, settings.domain);
		console.log('Server started on http://' + settings.domain + ':' + settings.port + '/');
		console.log('Ready to go! Lets get started!');
	};
})();