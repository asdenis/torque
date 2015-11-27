var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var ip = __dirname;

app.get('/', function(req, res){
  //send the index.html file for all requests
  res.sendFile(ip + '/login.html');
});

app.get('/live', function(req, res){
  //send the index.html file for all requests
  res.sendFile(ip + '/index.html');
});

app.use('/assets', express.static(ip + '/assets'));

http.listen(80, function(){
  console.log('listening on *:80');
  console.log(__dirname);
});

var io = require('socket.io')(http);
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var portName = "COM3";

var myPort = new SerialPort(portName,{
	baudRate:9600,
	parser:serialport.parsers.readline("\r\n")
})

myPort.on('open',onOpen);
myPort.on('data',onData);

function onOpen(){
	console.log("Conexión de Puerto Serie establecida");
}

function onData(data){
	//console.log(data);
  io.emit('message', data);
}


