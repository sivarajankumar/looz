/**
 * Get system settings from 'settings.json' and from command line, allowing command
 * line arguments to override any setting loaded from 'settings.json'.
 * In command line values with equal ('=') sign will be split into key-value pair.
 * Other keys will have 'null' value.
 */
(function(){
	'use strict';

	var _ = require('lodash-node'),
		defaults = require('../settings.json');

	function mergeCommandLineSettings(){
		var commandLineArgs = {};

		process.argv.forEach(function(val) {
			var keyValueIndex = val.indexOf('='),
				key, value;			
		   
			if(keyValueIndex === -1){
				//If key contains slashes, which means it's a path and therefor should be ignored.
				if(val.indexOf('/') === -1 && val.indexOf('\\') === -1){
		    		commandLineArgs[val] = null;
		    	}				
			}
			else{
				key = val.substring(0, keyValueIndex);
				value = val.substring(keyValueIndex + 1, val.length);
				commandLineArgs[key] = value;
			}	 
		});

		_.merge(defaults, commandLineArgs);
	}	 

	mergeCommandLineSettings();
	module.exports = defaults;
})();
