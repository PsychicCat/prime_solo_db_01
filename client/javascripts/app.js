$(document).ready(function(){
    var $users = $('#users');

    $users.on('click', '.delete', function(){
        var id = $(this).data('id');
        removeUser(id);
        $(this).parent().remove();
    });

    //users will refresh every 20 seconds and update if new user detected
    setInterval(function(){getAllUsers()}, 10000);
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