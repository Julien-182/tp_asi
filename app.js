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
var contentRoute = require("./app/routes/content.route.js");
var loginRoute = require("./app/routes/login.route.js");

var IOController = require("./app/controllers/io.controller.js");


// init server
var app = express();
app.use(bodyParser.json());
app.use(defaultRoute);
app.use(presentationRoute);
app.use(contentRoute);
app.use(loginRoute);

// static routes
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));
app.use(express.static(path.join(__dirname, 'public')));


var server = http.createServer(app);
server.listen(CONFIG.port, function(err){
});

IOController.listen(server);
