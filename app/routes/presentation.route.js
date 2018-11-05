var CONFIG = JSON.parse(process.env.CONFIG);

var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
module.exports = router;


router.route('/loadPres')
  .get(function(request, response){
      fs.readdir(CONFIG.presentationDirectory, function(err,files){
        var result = {}; //Objet contenant les présentations

        if(err){
            console.error(err.message);
            response.writeHead(500);
            response.end(err.message);
            return;
        }

        files.forEach(function(fileName,index) {
          if (path.extname(fileName) === ".json") {
            fs.readFile(CONFIG.presentationDirectory + fileName, function(errFile, content){
              if(errFile){
                console.log(errFile.message);
              }
              result[fileName.replace(".pres.json","")] = JSON.parse(content.toString());

              if(index == (files.length-1)){
                response.writeHead(200, {"Content-Type" : "application/json"});
                response.end(JSON.stringify(result));
              }
            });
          }
      });
  });
});

/**
{
  "ID" : "id de la pres",
  "content" : {
    "key" : "val"
    ...
  }
}
*/
router.route('/savePres')
  .post(function(request, response){
    var requestJson = request.body;

    if(requestJson.ID && requestJson.content){
      var id = requestJson.ID;
      var content = JSON.stringify(requestJson.content,null,2);

      fs.open(CONFIG.presentationDirectory + id + ".pres.json", 'w+', (errFd, fd) => {
        if(errFd){
          console.log(errFd);
        }

        fs.writeFile(CONFIG.presentationDirectory + id + ".pres.json", content, function(err){
          fs.close(fd, function(err){});
          response.writeHead(200);
          response.end("Presentation sauvegardee");
        });
      });
    }
  });
