(function(){
	'use strict';

	console.log('Firing up the server...');

	var server = require('./core/server.js'),
		settings = require('./core/settings.js'),
		db = require('./core/db.js'),
		routing = require('./core/routing.js'),
		activities = require('./entities/activity.js'),
		locations = require('./entities/location.js');

	activities.register();	
	locations.register();	

	db.open(settings, function dbOpend(){		
		server.start(settings, routing);
	});

})();

