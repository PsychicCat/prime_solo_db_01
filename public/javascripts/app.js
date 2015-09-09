$(document).ready(function(){
    var $users = $('#users');
    var $messages = $('#messageform');

    $messages.on('submit', function(e){
        e.preventDefault();
        var message = $(this).serializeArray()[0];

        $.ajax({
            url: '/message',
            type: 'POST',
            data: message,
        }).done(function(response, textStatus, jqXHR){
            console.log('Added message to db');
            updateMessages();
        }).fail(function( jqXHR, textStatus, errorThrown ) {
            console.log(jqXHR, textStatus, errorThrown);
        }).always(function(){
            console.log('Ajax complete');
        });
    });

    $('#messages').on('click', '.deleteMsg', function(){
        var id = $(this).data('id');
        $(this).parent().remove();

        $.ajax({
            url: '/message/' + id,
            type: 'DELETE',
        }).done(function(response, textStatus, jqXHR){
            console.log('Deleted user');
        }).fail(function( jqXHR, textStatus, errorThrown ) {
            console.log(jqXHR, textStatus, errorThrown);
        }).always(function(){
            console.log('Ajax complete');
        });
    });

    $users.on('click', '.delete', function(){
        var id = $(this).data('id');
        removeUser(id);
        $(this).parent().remove();
    });

    //users will refresh every 20 seconds and update if new user detected
    //setInterval(function(){getAllUsers()}, 10000);
});

function removeUser(id){
    $.ajax({
        url: '/users/' + id,
        type: 'DELETE'
    }).done(function(response, textStatus, jqXHR){
        console.log('Deleted user ' + id);
    }).fail(function( jqXHR, textStatus, errorThrown ) {
        console.log(jqXHR, textStatus, errorThrown);
    }).always(function(){
        getAllUsers();
    });
}

function getAllUsers(){
    $.ajax({
        url: '/update',
        type: 'GET',
        ifModified: true
    }).done(function(response, textStatus, jqXHR){
        if(jqXHR.status == 200){
            $('#users').empty();
            var source = $('#usersList').html();
            var template = Handlebars.compile(source);
            $('#users').append(template(response));
        }
    }).fail(function( jqXHR, textStatus, errorThrown ) {
        console.log(jqXHR, textStatus, errorThrown);
    }).always(function(){
        console.log('Ajax complete');
    });
}

function updateMessages(){
    $.ajax({
        url: '/update/messages',
        type: 'GET',
        ifModified: true
    }).done(function(response, textStatus, jqXHR){
        if(jqXHR.status == 200){
            $('#messages').empty();
            var source = $('#messagesList').html();
            var template = Handlebars.compile(source);
            $('#messages').append(template(response));
        }
    }).fail(function( jqXHR, textStatus, errorThrown ) {
        console.log(jqXHR, textStatus, errorThrown);
    }).always(function(){
        console.log('Ajax complete');
    });
}