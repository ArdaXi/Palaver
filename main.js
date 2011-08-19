var net = require('net'),
    server = net.createServer(function (socket) {
  	socket.on('data', function (data) {                     // data is a raw binary buffer
            var envelope = JSON.parse(data.toString('utf8'));   // decoded into a UTF8 string and parsed as JSON
        });
	});