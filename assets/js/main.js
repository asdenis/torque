var socket = io();
var laps = [];
var totalLaps;
var tiempo;
var semaforoStatus;
var onRace = false;
//TIMERS
var timerPrincipal;
var timerPrincipalST = true;
var something;
var pj1 = [something];
var pj2 = [something];
var pj3 = [something];
var pj4 = [something];

var totalPlayers = 1;
var puestosInit = ['1','2','3','4'];
var puestos = ['pj1','j2','j3','j4'];
var posVuelta = [];

var lapspj1 = 0;
var lapspj2 = 0;
var lapspj3 = 0;
var lapspj4 = 0;

$( document ).ready(function() {
    settingIniciales();    
    //Establecer sonidos
    ion.sound({
            sounds: [
                {name: "vuelta"},
                {name: "beeps"},
                {name: "beepl"}
            ],
            path: "assets/sound/",
            preload: true,
            volume: 1.0
    });
});

socket.on('message', function(msg){
    console.log(msg);
    if(msg == "start"){
        puntoCero();
    }
    
    if(msg == "interOn"){
        prepare();
    }
    
    if(msg == "sfrInit"){
        semaforo();
    }
    
    if(semaforoStatus){
        changeSmf(msg);
        if(msg == "beeps"){
            ion.sound.play("beeps");
        }
        if(msg == "beepl"){
            ion.sound.play("beepl");
        }
    }
    
    if(msg == "cdinit"){
        timerPrincipal =  countdown(
                        new Date(),
                        function(ts) {
                            var t= formatTime(ts.minutes)+":"+formatTime(ts.seconds);
                            $('.countdown').html(t);
                        },
                        countdown.HOURS|countdown.MINUTES|countdown.SECONDS|countdown.MILLISECONDS);
        
        pj1[0] = countdown(
                        new Date(),
                        function(ts) {
                            var t= formatTime(ts.minutes)+":"+formatTime(ts.seconds)+":"+ts.milliseconds;
                            $('#pj1 .time').html(t);
                        },
                        countdown.HOURS|countdown.MINUTES|countdown.SECONDS|countdown.MILLISECONDS);
                        
       pj2[0] = countdown(
                        new Date(),
                        function(ts) {
                            var t= formatTime(ts.minutes)+":"+formatTime(ts.seconds)+":"+ts.milliseconds;
                            $('#pj2 .time').html(t);
                        },
                        countdown.HOURS|countdown.MINUTES|countdown.SECONDS|countdown.MILLISECONDS);
       
       pj3[0] = countdown(
                        new Date(),
                        function(ts) {
                            var t= formatTime(ts.minutes)+":"+formatTime(ts.seconds)+":"+ts.milliseconds;
                            $('#pj3 .time').html(t);
                        },
                        countdown.HOURS|countdown.MINUTES|countdown.SECONDS|countdown.MILLISECONDS);
                        
       pj4[0] = countdown(
                        new Date(),
                        function(ts) {
                            var t= formatTime(ts.minutes)+":"+formatTime(ts.seconds)+":"+ts.milliseconds;
                            $('#pj4 .time').html(t);
                        },
                        countdown.HOURS|countdown.MINUTES|countdown.SECONDS|countdown.MILLISECONDS);
       live();
    }
    
    if(onRace){
        ///////////////////////////////////////////////////
        //CUENTA VUELTAS
        //////////////////////////////////////////////////
        if(msg == 'pj1' || msg == 'pj2' || msg == 'pj3' || msg == 'pj4'){
            cuentaVueltas(msg);
            //reproducir sonido
            ion.sound.play("vuelta");
        }
    }
    
    if(msg == "cdresults"){
        resultados();
    }
    
    if(msg == "streset"){
        settingIniciales();
    }
});

function cuentaVueltas(player){
    
    // if(laps.length <= totalLaps){
    if(onRace){
        //obtener tiempo de vuelta
        var t = $('#'+player+' .time').html();

        //Obtengo numero de jugador
        var sp = player.split('pj');
        sp = sp[1];
        
        switch (sp) {
            case '1':
                window.clearInterval(pj1[0]);
                pj1.push(t);
                pj1[0] = countdown(
                                new Date(),
                                function(ts) {
                                    var t= formatTime(ts.minutes)+":"+formatTime(ts.seconds)+":"+ts.milliseconds;
                                    $('#'+player+' .time').html(t);
                                },
                                countdown.HOURS|countdown.MINUTES|countdown.SECONDS|countdown.MILLISECONDS);
                console.log("ENTRA EN VUELTA");
                console.log(pj1);
                $('#stats'+player+' > table > tbody').html('');
                for(var i=0; i<(pj1.length-1); i++){
                    //dibuja grilla
                    var fila = "<tr><td>"+(i+1)+"</td><td>"+pj1[i+1]+"</td></tr>";
                    $('#stats'+player+' > table > tbody').append(fila);
                }
                if(laps[pj1.length-2] == undefined ){laps[pj1.length-2] = true;}
                lapspj1++;                
                //Puestos
                showPos(player,lapspj1);
                break; 
            case '2':
                window.clearInterval(pj2[0]);
                pj2.push(t);
                pj2[0] = countdown(
                                new Date(),
                                function(ts) {
                                    var t= formatTime(ts.minutes)+":"+formatTime(ts.seconds)+":"+ts.milliseconds;
                                    $('#'+player+' .time').html(t);
                                },
                                countdown.HOURS|countdown.MINUTES|countdown.SECONDS|countdown.MILLISECONDS);
                $('#stats'+player+' > table > tbody').html();
                for(var i=0; i<(pj2.length-1); i++){
                    //dibuja grilla
                    var fila = "<tr><td>"+(i+1)+"</td><td>"+pj2[i+1]+"</td></tr>";
                    $('#stats'+player+' > table > tbody').append(fila);
                }
                if(laps[pj2.length-2] == undefined ){laps[pj2.length-2] = true;}
                lapspj2++;                
                //Puestos
                showPos(player,lapspj2);
                break;                
           case '3':
                window.clearInterval(pj3[0]);
                pj3.push(t);
                pj3[0] = countdown(
                                new Date(),
                                function(ts) {
                                    var t= formatTime(ts.minutes)+":"+formatTime(ts.seconds)+":"+ts.milliseconds;
                                    $('#'+player+' .time').html(t);
                                },
                                countdown.HOURS|countdown.MINUTES|countdown.SECONDS|countdown.MILLISECONDS);
                $('#stats'+player+' > table > tbody').html();
                for(var i=0; i<(pj3.length-1); i++){
                    //dibuja grilla
                    var fila = "<tr><td>"+(i+1)+"</td><td>"+pj3[i+1]+"</td></tr>";
                    $('#stats'+player+' > table > tbody').append(fila);
                }
                if(laps[pj3.length-2] == undefined ){laps[pj3.length-2] = true;}
                lapspj3++;                
                //Puestos
                showPos(player,lapspj3);
                break; 
           case '4':
                window.clearInterval(pj4[0]);
                pj4.push(t);
                pj4[0] = countdown(
                                new Date(),
                                function(ts) {
                                    var t= formatTime(ts.minutes)+":"+formatTime(ts.seconds)+":"+ts.milliseconds;
                                    $('#'+player+' .time').html(t);
                                },
                                countdown.HOURS|countdown.MINUTES|countdown.SECONDS|countdown.MILLISECONDS);
                $('#stats'+player+' > table > tbody').html();
                for(var i=0; i<(pj4.length-1); i++){
                    //dibuja grilla
                    var fila = "<tr><td>"+(i+1)+"</td><td>"+pj4[i+1]+"</td></tr>";
                    $('#stats'+player+' > table > tbody').append(fila);
                }
                if(laps[pj4.length-2] == undefined ){laps[pj4.length-2] = true;}
                lapspj1++;                
                //Puestos
                showPos(player,lapspj4);
                break;
        }
        
        //actualizar vueltas totales
        if(laps.length < totalLaps){
            $('#lapsBox > p').html("<span>VUELTA</span> "+(laps.length+1)+" / "+totalLaps);
        }
        
        if(posVuelta[totalLaps-1] != undefined){
            if(posVuelta[totalLaps-1].length == totalPlayers){
                //finalizar carrera
                if(laps.length == totalLaps){
                    console.log("finalizar carrera");
                    resultados();
                }
            }
        }
        
    }  
    
}

function puntoCero(){
    console.log("PUNTO CERO !!!!!");
    $('#titlePanel').removeClass();
    $('#titlePanel').addClass("out");
    $('#titlePanel .state').html("Inicie el asistente");
}

function prepare(){
    console.log("Peparando largada !!!!!");
    $('#titlePanel').removeClass();
    $('#titlePanel').addClass("wait");
    $('#titlePanel .state').html("Peparando largada");
}

function semaforo(){
    console.log("Semaforo !!!!!");
    $('#titlePanel').removeClass();
    $('#titlePanel').addClass("stop");
    $('#titlePanel .state').html("Preparados...");
    semaforoStatus = true;
}

function changeSmf(rgb){
    $('#titlePanel div').css("background","rgb("+rgb+")");
}

function live(){
    console.log("En carrera !!!!!");
    semaforoStatus = false;
    onRace = true;
    $('#titlePanel div').removeAttr( "style" )
    $('#titlePanel').removeClass();
    $('#titlePanel').addClass("live");
    $('#titlePanel .state').html("Corriendo...");
    $('#lapsBox > p').html("<span>VUELTA</span> 1 / "+totalLaps);
}

function resultados(){
    window.clearInterval(timerPrincipal);
    window.clearInterval(pj1[0]);
    window.clearInterval(pj2[0]);
    window.clearInterval(pj3[0]);
    window.clearInterval(pj4[0]);
    onRace = false;
    console.log("Resultados !!!!!");
    $('#titlePanel').removeClass();
    $('#titlePanel').addClass("out");
    $('#titlePanel .state').html("Resultados Finales");
}

function settingIniciales(){ 
    
    console.log("Reset !!!!!");
    laps = [];
    totalLaps = 3;
    tiempo = "00:00";
    var tiempoMillis = "00:00:000";
    semaforoStatus = false;
    onRace = false;
    totalPlayers = 1;
    
    //TIMERS
    timerPrincipal = 0;
    timerPrincipalST = true;
    pj1 = null;
    pj1 = [something];
    pj2 = null;
    pj2 = [something];
    pj3 = null;
    pj3 = [something];
    pj4 = null;
    pj4 = [something];
    
    lapspj1 = 0;
    lapspj2 = 0;
    lapspj3 = 0;
    lapspj4 = 0;

    puestosInit = ['1','2','3','4'];
    puestos = null;
    puestos = ['pj1','pj2','pj3','pj4'];
    posVuelta = null;
    posVuelta = [];
    
    //Tag Indicador de estado
    $('#titlePanel').removeClass();
    $('#titlePanel').addClass("out");
    $('#titlePanel .state').html("Esperando al servidor");
    
    //contadores
    $('.countdown').html(tiempo);
    $('#pj1 .time').html(tiempoMillis);
    $('#pj2 .time').html(tiempoMillis);
    $('#pj3 .time').html(tiempoMillis);
    $('#pj4 .time').html(tiempoMillis);
    
    //Vueltas
    $('#lapsBox p').html("<span>VUELTA</span> 0 / "+totalLaps);
    
    //Grilla de tiempos de jugadores
    $('#statspj1 > table > tbody').html("");
    $('#statspj2 > table > tbody').html("");
    $('#statspj3 > table > tbody').html("");
    $('#statspj4 > table > tbody').html("");
}

function formatTime(n){
    return n<10 ? '0'+n : n;
}

function showPos(player, lapspj){
    if(posVuelta[lapspj-1] == undefined){
        posVuelta[lapspj-1] = [];
    }
    posVuelta[lapspj-1].push(player);
    var indice = puestos.indexOf(player);
    puestos.splice(indice, 1);
    puestos.splice(posVuelta[lapspj-1].length-1, 0, player);
    dibujaPuestos(puestos);
}

function dibujaPuestos(pos){
    for(var i=0; i<pos.length; i++){
        $('#'+pos[i]+' .position').html(i+1);
    }
    
}
