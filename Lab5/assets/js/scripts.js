
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
    $.ajax({
        url: '/users/login',
        type: 'POST',
        data: {
            email: email,
            password: password
        },
        success: function(data) {
            if (data.error) {
                alert(data.message);
                console.log("failure",data);
            } else {
                console.log("success", data);
                window.location.href = '/';
            }
        }
    });
}
);

