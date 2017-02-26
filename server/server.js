var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

app.use(express.static(path.join(__dirname,"../public")));

http.listen(port, function(){
  console.log('listening on *:3000');
});

var users = {};

io.on('connection', function(socket){
  socket.on('new user', function(username,state,img){
    console.log('a user connected: ' + socket.id + username);
    users[socket.id] = [username,state,img];
    socket.emit('user info',users[socket.id]);
    //io.emit('new user',users[socket.id]);
    io.emit('list user', users);
    socket.broadcast.emit('new user joined', username);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected: ' + socket.id);
    socket.broadcast.emit('delete user', users[socket.id]);
    delete users[socket.id];
    io.emit('disconnect', users);
  });
  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg, users[socket.id][0], socket.id);
  });

  socket.on('writing', function(){
    io.emit('writing', socket.id);
  });

  socket.on('end writing', function(){
    io.emit('end writing', socket.id);
  });
});