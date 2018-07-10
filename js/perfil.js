function perfil() {
    var user = localStorage.getItem("NOMBRE");
    var pass = localStorage.getItem("CONTRASENNA");
    var req = $.ajax({
        url: 'https://umemory.azurewebsites.net/Manager.svc/identify?username=' + user + '&password=' + pass,
        timeout: 10000,
        dataType: "jsonp"
    });
    req.done(function(data) {
        if (data) {
            localStorage.setItem("IDJUGADOR", data.idJugador);
            records();
        } else {
            alert("afuera DENTRO DE IF QUE NO SIRVIO");
            logout();
            alert("Credenciales incorrectas. Ingrese de nuevo");
        }
    });
    req.fail(function() {
        alert("No fue posible establecer la conexión");
    });
}

function records() {
    var id = localStorage.getItem("IDJUGADOR");
    var req = $.ajax({
        url: 'https://umemory.azurewebsites.net/Manager.svc/showListRegistro?id_Jugador=' + id,
        timeout: 10000,
        dataType: "jsonp"
    });

    req.done(function(data) {
        $.each(data, function() {
            $('#tableRecords > tbody:last-child').append('<tr></td><td class="name column">' + this.puntaje + '</td><td class="name column">' + this.nivel_jugado + '</tr>');
        });
        score();
    });

    req.fail(function() {
        document.getElementById("scoreTotal").innerHTML = "Puntaje total acumulado: 0"
    });
}
/************************************************************************************************* */

function score() {
    var idPlayer = localStorage.getItem("IDJUGADOR");
    var req = $.ajax({
        url: 'https://umemory.azurewebsites.net/Manager.svc/totalScore?idJugador=' + idPlayer,
        timeout: 10000,
        dataType: "jsonp"
    });
    req.done(function(data) {
        if (data) {
            localStorage.setItem("PUNTAJETOTAL", data);
            document.getElementById("scoreTotal").innerHTML = "Puntaje total acumulado: " + data;
        } else {
            logout();
            alert("No fue posible establecer la conexión");
        }
    });
    req.fail(function() {
        document.getElementById("scoreTotal").innerHTML = "Puntaje total acumulado: 0"
    });
}


/************************************************************************************************* */

function resetScore() {
    var idPlayer = localStorage.getItem("IDJUGADOR");
    var req = $.ajax({
        url: 'https://umemory.azurewebsites.net/Manager.svc/restartRecord?id_Jugador=' + idPlayer,
        timeout: 10000,
        dataType: "jsonp"
    });
    req.done(function(data) {
        if (data) {
            document.getElementById("scoreTotal").innerHTML = "Puntaje total acumulado: 0"
        } else {
            logout();
            alert("No fue posible establecer la conexión");
        }
    });
    req.fail(function() {
        alert("No fue posible establecer la conexión");
    });
}