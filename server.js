
console.log('env: ' + JSON.stringify(process.env));
console.log('cwd: ' + process.cwd());

process.env.PWD = process.cwd();

var express = require('express');
var https = require('https');
var http = require('http');
var app = express();

app.use(express.static(process.env.PWD + '/public'));

http.createServer(app).listen((process.env.PORT || 5000));

var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello from Trello-Cal\n");
});

console.log("Server running at localhost:" + app.get('port'));
