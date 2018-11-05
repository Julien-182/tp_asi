"use strict";

// Initialisation express
var express = require("express");
var app = express();
var defaultRoute = require("./app/routes/default.route.js");
var path = require("path");

// Initialisation serveur web
var http = require("http");
var CONFIG = require("./config.json");
var server = http.createServer(app);
server.listen(CONFIG.port);

// Configuration accessible par tous les modules
var CONFIG = require("./config.json");
process.env.CONFIG = JSON.stringify(CONFIG);

// Import et utilisation de la route
app.use(defaultRoute);

// Routes pages admin et watch
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));

console.log('It works !');
