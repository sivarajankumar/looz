(function(){
	'use strict';

	var server = require('./core/server.js'),
		settings = require('./core/settings.js'),
		db = require('./core/db.js'),
		routing = require('./core/routing.js'),
		activities = require('./entities/activity.js');

	activities.register();	

	db.open(settings, function dbOpend(){		
		server.start(settings, routing);
	});

})();

