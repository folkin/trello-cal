var port = (process.env.PORT || 5000);
var http = require('http');

var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello from Trello-Cal\n");
});

server.listen(port);
console.log("Server running at localhost:" + port);

