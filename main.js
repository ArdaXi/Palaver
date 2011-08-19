var net = require('net'),
	users = [],
    server = net.createServer(function (socket) {
		var userid;
  		socket.on('data', function (data) { 	// data is a raw binary buffer
            var envelope = JSON.parse(data.toString('utf8'));   // decoded into a UTF8 string and parsed as JSON
			if(userid == null) {
				if(envelope.type != "auth" || envelope.name === undefined) // TODO: Add in proper auth later.
					socket.end('{"type":"error","msg":"1 Authentication Required"}');
				userid = users.length;
				users[userid] = {
					"name": envelope.name, //TODO: Parse this for allowed chars using regex
					"socket": socket
				};
			} else {
				if(handlers[envelope.type] != null)
				{
					envelope.userid = userid;
					handlers[envelope.type](envelope);
				}
			}
        });
	}),
	rooms = {1: []}, // Entries of the array should be { id, time }
	handlers = {
		'join': function(envelope) {
			rooms[envelope.room].push({"id":envelope.userid, "time":Date.now});
		}
		'message': function(envelope) {
			var time = Date.now;
			for (user in rooms[envelope.room]) {
				users[user].socket.write(JSON.stringify({'id':envelope.userid,'msg':envelope.msg,'time':Date.now}));
			}
		}
	};