"use strict";

var express = require("express");
var http = require("http");
var url = require("url");
var path = require("path");
const bodyParser = require('body-parser');

var CONFIG = require("./config.json");
process.env.CONFIG = JSON.stringify(CONFIG);

var defaultRoute = require("./app/routes/default.route.js");
var presentationRoute = require("./app/routes/presentation.route.js");


// init server
var app = express();
app.use(bodyParser.json());
app.use(defaultRoute);
app.use(presentationRoute);

// static routes
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));


var server = http.createServer(app);
server.listen(CONFIG.port, function(err){
});
