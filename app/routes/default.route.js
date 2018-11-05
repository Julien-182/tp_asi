var CONFIG = JSON.parse(process.env.CONFIG);

var express = require("express");
var router = express.Router();
module.exports = router;


router.route('/')
  .get(function(request, response){
      response.writeHead(200);
      response.end("<!DOCTYPE html>" +
                    "<html><body style='height:100vh;width:100vw;display:flex;justify-content:center;'>" +
                        "<span style='font-family: cursive;font-size:3em;'>It Works !</span>" +
                    "</body></html>");
  })
  .post(function(request, response){

  })
  .put(function(request, response){

  })
  .delete(function(request, response){

  })
  .all(function(request, response){

  })
