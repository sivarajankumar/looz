(function(){
	'use strict';

	var mongoose = require('mongoose');
	
	exports.connection = null;
	exports.open = function (settings, callback){
		mongoose.connect('mongodb://'+ settings.dbDomain +':'+ settings.dbPort);
		exports.connection = mongoose.connection;
		mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
		mongoose.connection.once('open', callback);
	};
})();