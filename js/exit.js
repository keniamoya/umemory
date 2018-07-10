$(document).ready(function() {
    setTimeout(function() {
        $(".container").fadeOut(100);
        setTimeout("location.href='login.html'", 0);
    }, 3000);

});

var i = 0;

function typeWriter() {
    var txt = 'Saliendo...';
    var speed = 100;
    if (i < txt.length) {
        document.getElementById("demo").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}
typeWriter();

//esto es una prueba
//una pruebita