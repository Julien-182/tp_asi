"use strict";

var CONFIG = JSON.parse(process.env.CONFIG);

var multer = require("multer");
var express = require("express");

var router = express.Router();
module.exports = router;

var contentController = require("../controllers/content.controller.js");
var multerMiddleware = multer({ "dest": "/tmp/" });

router.route('/contents')
  .get(contentController.list);
router.post("/contents", multerMiddleware.single("file"), contentController.create);
/*
  - request.file.path : le chemin d'acces du fichier sur le serveur
  - request.file.originalname : le nom original du fichier
  - request.file.mimetype : le type mime
*/

router.route('/contents/:contentId')
  .get(contentController.read)
  .put(contentController.update)
  .delete(contentController.remove);
