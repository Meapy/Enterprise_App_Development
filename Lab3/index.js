var http = require('http');
var url = require('url');
var fs = require('fs');
const path = require('path')

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  fs.readFile(filename, function (err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end("404 Not Found");
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
  }); // you can use 'return' to ensure you stop after the (first) callback
}).listen(8080);

//create a function that makes a table from the json files in country-objects
async function create_table() {

}
create_table();