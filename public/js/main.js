$(document).ready(function(){
  $('#myModal').modal({backdrop: 'static', keyboard: false});
  var socket = io();
  $('form').submit(function(){
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
  });
  socket.on('chat message', function(msg, username, id){
    var time = new Date($.now());
    if (id == socket.id) {
      $('#list-messages').append($('<li class="own-message">').text(username + ": " + msg + " (" + time.getHours() + ":" + time.getMinutes() + ")"));
    }else{
      $('#list-messages').append($('<li>').text(username + ": " + msg + " (" + time.getHours() + ":" + time.getMinutes() + ")"));
    }
  });
  socket.on('user info', function(user){
    if (user !== null) {
      $('#label-username').text(user[0]);
      $('#label-state').text(user[1]);
      $('#user-avatar').attr({src: user[2], hidden: false});
    }
  });
  socket.on('new user joined', function(username){
    if (username !== null) {
      $('#list-messages').append($('<li>').text(username + " se ha unido a la conversación."));
    }
  });
  socket.on('delete user', function(user){
    if (user !== null) {
      $('#list-messages').append($('<li>').text(user[0] + " ha abandonado la conversación."));
    }
  });
  socket.on('list user', function(users){
    $('#list-users').empty();
    for (var key in users) {
      $('#list-users').append($('<li>'));
      $('#list-users li:last-child').append($('<img src="' + users[key][2] +'">'));
      $('#list-users li:last-child').append($('<label>' + users[key][0] + ", " + users[key][1] + '</label>'));
    }
  });
  socket.on('disconnect', function(users){
    $('#list-users').empty();
    for (var key in users) {
      $('#list-users').append($('<li>'));
      $('#list-users li:last-child').append($('<img src="' + users[key][2] +'">'));
      $('#list-users li:last-child').append($('<label>' + users[key][0] + ", " + users[key][1] + '</label>'));
    }
  });
  /*socket.on('hi', function(msg){
    console.log("Nuevo usuario conectado");
  });*/
  $('#btn-modal').click(function(){
    if($('#username').val() && $('#state').val()){
        socket.emit('new user', $('#username').val(), $('#state').val(), $('input[name=avatar]:checked').val());
        $('#username').val("");
        $('#state').val("");
        $('#radio-default').prop("checked", true);
    }else{
      return false;
    }
  });

  $("#username, #state").keyup(function(e){ 
    if(e.keyCode==13){
      e.preventDefault();
      if($('#username').val() && $('#state').val()){
        socket.emit('new user', $('#username').val(), $('#state').val(), $('input[name=avatar]:checked').val());
        $('#myModal').modal("hide");
        $('#username').val("");
        $('#state').val("");
        $('#radio-default').prop("checked", true);
      }
    }
  });
});