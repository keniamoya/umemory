var symbols = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
    opened = [],
    match = 0,
    moves = 0,
    $deck = $('.deck'),
    $scorePanel = $('#score-panel'),
    rating = 3,
    $moveNum = $scorePanel.find('.moves'),
    $ratingStars = $scorePanel.find('i'),
    $restart = $scorePanel.find('.restart'),
    delay = 800,
    gameCardsQTY = symbols.length / 2, //6
    rank3stars = gameCardsQTY - 4, //2 3m  
    rank2stars = gameCardsQTY - 2, //4 5m 
    rank1stars = gameCardsQTY; //6 7m  

var idQuestion = 1;
var puntaje = 0;

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Initial Game
function initGame() {
    var cards = shuffle(symbols);
    $deck.empty();
    match = 0;
    moves = 0;
    $moveNum.html(moves);
    $ratingStars.removeClass('fa-star-o').addClass('fa-star');
    for (var i = 0; i < cards.length; i++) {
        $deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
    }
};

// Set Rating and final Score
function setRating() {
    if ((moves - match) == 4) { //4 moves
        $ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
        rating = 2;
        questionLevel3();
    } else if ((moves - match) == 6) { //6 moves
        $ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
        questionLevel3();
    } else if ((moves - match) >= 8) { //8 moves
        $ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
        rating = 0;
        questionLevel3();
    }
    return { score: rating };
};

/************************************************************************************************* */

function questionLevel3() {
    $('#tablero').hide();
    $('#question').show();
    $('#btnSend').hide();
    var level = 3;
    var req = $.ajax({
        url: 'https://umemory.azurewebsites.net/Manager.svc/loadQuestion?nivel=' + level,
        timeout: 10000,
        dataType: "jsonp"
    });
    req.done(function(data) {
        if (data) {
            idQuestion = data.idPregunta;
            document.getElementById("enunciado").innerHTML = data.enunciado;
            document.getElementById("opcion1").innerHTML = data.opcion1;
            document.getElementById("opcion2").innerHTML = data.opcion2;
            document.getElementById("opcion3").innerHTML = data.opcion3;
            document.getElementById("opcion4").innerHTML = data.opcion4Correcta;
        } else {
            logout();
            alert("No fue posible establecer la conexión");
        }
    });
    req.fail(function() {
        alert("No fue posible establecer la conexión");
    });
}

/************************************************************************************************* */

function getAnswer() {
    var answerPlay = document.getElementById("ans").value;
    $('#question').hide();
    $('#tablero').hide();
    $('#answer').show();
    var req = $.ajax({
        url: 'https://umemory.azurewebsites.net/Manager.svc/questionAnswer?idQuery=' + idQuestion,
        timeout: 10000,
        dataType: "jsonp"
    });
    req.done(function(data) {
        if (data) {
            if (answerPlay == data) {
                document.getElementById("state").innerHTML = "CORRECTO!";
                document.getElementById("respuesta").innerHTML = "Respuesta correcta: " + data;
                puntaje = (puntaje + 15);
                //alert(puntaje)
                localStorage.setItem("PUNTAJE", puntaje);
                document.getElementById("puntaje").innerHTML = "Puntaje acumulado: " + puntaje;
            } else {
                document.getElementById("state").innerHTML = "INCORRECTO!";
                document.getElementById("respuesta").innerHTML = "Respuesta correcta: " + data;
                document.getElementById("puntaje").innerHTML = "Puntaje acumulado: " + puntaje;
            }
        } else {
            logout();
            alert("No fue posible establecer la conexión");
        }
    });
    req.fail(function() {
        alert("No fue posible establecer la conexión");
    });
}

/************************************************************************************************* */

function getId() {
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
            registerScore();
        } else {
            logout();
            alert("Credenciales incorrectas. Ingrese de nuevo");
        }
    });
    req.fail(function() {
        alert("No fue posible establecer la conexión");
    });
}

/************************************************************************************************* */

function registerScore() {
    var idPlayer = localStorage.getItem("IDJUGADOR");
    var points = localStorage.getItem("PUNTAJE");
    var nivel = 3;
    var req = $.ajax({
        url: 'https://umemory.azurewebsites.net/Manager.svc/InsertRegister?id_jugador=' + idPlayer + '&puntaje=' + points + '&nivel_Jugado=+' + nivel,
        timeout: 10000,
        dataType: "jsonp"
    });
    req.done(function(data) {
        if (data) {
            getScore();
        } else {
            logout();
            alert("1No fue posible establecer la conexión");
        }
    });
    req.fail(function() {
        alert("2No fue posible establecer la conexión");
    });
}

/************************************************************************************************* */

function getScore() {

    var idPlayer = localStorage.getItem("IDJUGADOR");
    var req = $.ajax({
        url: 'https://umemory.azurewebsites.net/Manager.svc/totalScore?idJugador=' + idPlayer,
        timeout: 10000,
        dataType: "jsonp"
    });
    req.done(function(data) {
        if (data) {
            localStorage.setItem("PUNTAJETOTAL", data);
            changeLevel()
        } else {
            logout();
            alert("No fue posible establecer la conexión");
        }
    });
    req.fail(function() {
        alert("No tiene registros");
    });
}

/************************************************************************************************* */

function changeLevel() {
    var scoreTotal = localStorage.getItem("PUNTAJETOTAL");
    //puntaje = 0;
    //localStorage.setItem("PUNTAJE", puntaje);
    if (scoreTotal != null) {
        if (scoreTotal <= 150) {
            return 3;
        } else {
            return 4;
        }
    } else {
        alert("Sin registros")
    }

}

/************************************************************************************************* */



// End Game
function endGame(moves) {
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Felicidades! Ganó!',
        text: 'Con ' + moves + ' movimientos y ' + rating + ' Estrellas.' + '\nPuntaje acumulado: ' + puntaje + '\nEnhorabuena!',
        type: 'success',
        confirmButtonColor: 'teal',
        confirmButtonText: 'Jugar otra vez!'
    }).then(function(isConfirm) {
        if (isConfirm) {
            getId();
            puntaje = 0;
            initGame();
        }
    })
}

// Restart Game
$restart.on('click', function() {
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Esta seguro?',
        text: "Se perderá su progreso!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'gray',
        cancelButtonColor: 'teal',
        confirmButtonText: 'Si, reiniciar juego!',
        cancelButtonText: 'Cancelar'
    }).then(function(isConfirm) {
        if (isConfirm) {
            puntaje = 0;
            initGame();
        }
    })
});

// Card flip
$deck.on('click', '.card:not(".match, .open")', function() {
    if ($('.show').length > 1) { return true; }

    var $this = $(this),
        card = $this.context.innerHTML;
    $this.addClass('open show');
    opened.push(card);

    // Compare with opened card
    if (opened.length > 1) {
        if (card === opened[0]) {
            $deck.find('.open').addClass('match animated infinite rubberBand');
            setTimeout(function() {
                $deck.find('.match').removeClass('open show animated infinite rubberBand');
            }, delay);
            match++;
        } else {
            $deck.find('.open').addClass('notmatch animated infinite wobble');
            setTimeout(function() {
                $deck.find('.open').removeClass('animated infinite wobble');
            }, delay / 1.5);
            setTimeout(function() {
                $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
                setRating();
            }, delay);
        }
        opened = [];
        moves++;
        $moveNum.html(moves);
    }

    // End Game if match all cards
    if (gameCardsQTY === match) {
        setTimeout(function() {
            endGame(moves, rating);
        }, 500);
    }
});

initGame();