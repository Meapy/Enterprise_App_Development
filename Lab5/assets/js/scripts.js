
$('.register').click(function (event) {
    event.preventDefault();
    var name = $('#nameRegister').val();
    var email = $('#emailRegister').val();
    var password = $('#passwordRegister').val();
    $.ajax({
        url: '/users/register',
        type: 'POST',
        data: {
            name: name,
            email: email,
            password: password
        },
        function(data) {
            if (data.error) {
                alert(data.error);
            } else {
                alert(data.success);
                //window.location.href = '/';
            }
        }
    });
});
$('.login').click(function (event) {
    event.preventDefault();
    var email = $('#emailLogin').val();
    var password = $('#passwordLogin').val();
    console.log(email);
    $.ajax({
        url: '/users/login',
        type: 'POST',
        data: {
            email: email,
            password: password
        },
        success: function(data) {
            if (data.error) {
                alert(data.error);
                console.log(data);
            } else {
                console.log(data);
                alert(data.success);
                //window.location.href = '/';
            }
        }
    });
}
);

