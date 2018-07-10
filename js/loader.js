$(document).ready(function() {
    setTimeout(function() {
        $(".container1").fadeOut(100);
        setTimeout("location.href='login.html'", 0);
    }, 3000);

});

var i = 0;

function typeWriter() {
    var txt = 'Cargando...';
    var speed = 100;
    if (i < txt.length) {
        document.getElementById("demo").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}
typeWriter();