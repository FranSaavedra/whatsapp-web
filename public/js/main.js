$(document).ready(function(){
  $('#myModal').modal({backdrop: 'static', keyboard: false});
  var socket = io();
  $('form').submit(function(){
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#list-messages').append($('<li>').text(msg));
  });
  socket.on('new user', function(msg){
    console.log("username" + msg);
    //$('#label-username').val(msg);
    $('#list-messages').append($('<li>').text(msg + " se ha unido a la conversación."));
  });
  socket.on('delete user', function(msg){
    console.log("username" + msg);
    //$('#label-username').val(msg);
    $('#list-messages').append($('<li>').text(msg + " ha abandonado la conversación."));
  });
  socket.on('list user', function(msg){
    $('#list-users').empty();
    for (var key in msg) {
      $('#list-users').append($('<li>').text(msg[key]));
    }
  });
  socket.on('disconnect', function(msg){
    $('#list-users').empty();
    for (var key in msg) {
      $('#list-users').append($('<li>').text(msg[key]));
    }
  });
  /*socket.on('hi', function(msg){
    console.log("Nuevo usuario conectado");
  });*/
  $('#btn-modal').click(function(){
    if($('#username').val()){
        //console.log('nuevo nombre usuario');
        socket.emit('new user', $('#username').val());
        $('#username').val('');
        return true;
    }else{
      return false;
    }
  });

  $("#username").keyup(function(e){ 
    if(e.keyCode==13){
      e.preventDefault();
      if($('#username').val()){
        //console.log('nuevo nombre usuario');
        socket.emit('new user', $('#username').val());
        $('#username').val('');
        $('#myModal').modal("hide");
      }
    }
  });
});