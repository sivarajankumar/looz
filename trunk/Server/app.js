(function(){
	'use strict';

	var server = require('./core/server.js'),
		settings = require('./core/settings.js'),
		db = require('./core/db.js'),
		routing = require('./core/routing.js');

	db.open(settings, function dbOpend(){		
		server.start(settings, routing);
	});

})();

