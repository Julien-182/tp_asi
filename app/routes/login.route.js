var CONFIG = JSON.parse(process.env.CONFIG);

var express = require("express");
var http = require("http");
var router = express.Router();
module.exports = router;

var loginWsUrl = "localhost:8080/WatcherAuth"; //TODO

router.route('/login')
  .post(function(request, response){
    var post = request.body;

    if(!post.user || !post.password) return;

    var authData = {
      'login' : post.user,
      'pwd': post.password
    };

    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(authData)
      }
    }

    const loginReq = http.request(url, options, (res) => {
      res.setEncoding('utf8');

      var resData = "";
      res.on('data', (chunk) => {
        resData += chunk;
      });

      res.on('end', () => {
        request.writeHead(200);
        request.end(resData);
      });
    });

    loginReq.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    loginReq.write(authData);
    loginReq.end();
  });
