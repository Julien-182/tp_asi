"use strict";

var express = require("express");
var http = require("http");
var url = require("url");
var path = require("path");
var CONFIG = require("./config.json");
process.env.CONFIG = JSON.stringify(CONFIG);

var defaultRoute = require("./app/routes/default.route.js");

// init server
var app = express();
app.use(defaultRoute);

// static routes
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));


var server = http.createServer(app);
server.listen(CONFIG.port, function(err){
});
