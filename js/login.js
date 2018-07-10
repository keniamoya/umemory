$.ajaxSetup({
    'beforeSend': function(xhr) {
        xhr.overrideMimeType('text/html; charset=utf-8');
    }
});



function openOption(option, elmnt, color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(option).style.display = "block";
    elmnt.style.backgroundColor = color;

}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

/************************************************************************************************* */

function login() {
    var user = document.getElementById("name").value;
    var pass = document.getElementById("password").value;

    var req = $.ajax({
        url: 'https://umemory.azurewebsites.net/Manager.svc/loginSystem?username=' + user + '&password=' + pass,
        timeout: 10000,
        dataType: "jsonp"
    });

    alert("Bienvenido " + user);

    req.done(function(data) {
        if (data) {
            localStorage.setItem("NOMBRE", user);
            localStorage.setItem("CONTRASENNA", pass);
            window.location = './menu.html';
        } else {
            logout();
            alert("Credenciales incorrectas. Ingrese de nuevo");
        }
    });

    req.fail(function() {
        alert("No fue posible establecer la conexión");
    });
}

/********************************************************************************************************** */

function register() {
    var user = document.getElementById("username").value;
    var pass = document.getElementById("pwd").value;
    var mail = document.getElementById("email").value;
    var req = $.ajax({
        url: 'https://umemory.azurewebsites.net/Manager.svc/register?username=' + user + '&password=' + pass + '&mail=' + mail,
        timeout: 10000,
        dataType: "jsonp"
    });

    alert("Bienvenido " + user);

    req.done(function(data) {
        if (data) {
            localStorage.setItem("NOMBRE", user);
            localStorage.setItem("CONTRASENNA", pass);
            localStorage.setItem("CORREO", mail);
            window.location = './menu.html';
        } else {
            logout();
            alert("Credenciales incorrectas usuario o correo incorrecto. Ingrese de nuevo");
        };

    });

    req.fail(function() {
        alert("No fue posible establecer la conexión");
    });
}