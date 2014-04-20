(function(){
	'use strict';

	var _ = require('lodash-node'),
		defaults = {
			domain : '127.0.0.1',
			port : 1337
		};

	function get (){
		var result = {};
		process.argv.forEach(function(val) {
			var keyValueIndex = val.indexOf('='),
				key, value;

			if(keyValueIndex === -1){
				result[val] = null;
			}
			else{
				key = val.substring(0, keyValueIndex);
				value = val.substring(keyValueIndex + 1, val.length);
				result[key] = value;
			}	 
		});

		_.merge(defaults, result);
		return defaults;
	}	 

	exports.get = get;
})();
