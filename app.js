var express = require('express');
var app = new express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nicknames = [];


app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + "/public" ))


io.on('connection', function(socket){
	
	function updateNicknames(){
		io.emit('usernames', nicknames);
	};

	socket.on('novo user', function(data, callback){
		if(nicknames.indexOf(data) != -1){
			callback(false);
		}
		else{
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			updateNicknames();
			console.log('Utilizador ', socket.nickname, ' juntou-se ao chat')
		}
	});

	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();
	});

    var clientIp = socket.request.connection.remoteAddress;
        clientIp = clientIp.replace(/^.*:/, '');
    console.log('Utilizador ', clientIp, 'ligou-se');

    socket.on('chat message', function(msg){
    	io.emit('chat message',{msn : msg, nick: socket.nickname});
  	});
});

//http.listen(80);

http.listen(666, function(){
    console.log('listening on <ip>:666');
});
