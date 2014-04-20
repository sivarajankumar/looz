var http = require('http'),
	systemArgs = require('./config/system-args.js').get();
	

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(systemArgs.port, systemArgs.domain);
