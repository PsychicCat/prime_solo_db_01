$(document).ready(function(){
    var $user = $('.user');

    $user.on('click', function(){
        console.log($(this).data('id'));
        
    })
});