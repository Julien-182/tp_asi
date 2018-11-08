"use strict";

const utils = require("../utils/utils.js");
var fs = require("fs");
var CONFIG = JSON.parse(process.env.CONFIG);
var contentDirectory = CONFIG.contentDirectory;

//TODO faire passer les tests
class ContentModel {

  constructor(content) {
    if(content.type)
      this.type = content.type;
    if(content.id)
      this.id = content.id;
    if(content.title)
      this.title = content.title;
    if(content.src)
      this.src = content.src;
    if(content.fileName)
      this.fileName  = content.fileName;

    this.data = null // TODO: set private
  }

  getData(){
    return this.data;
  }

  setData(data){
    this.data = data;
  }

  // Méthodes statiques

  static create(content, callback){

    var meta = JSON.parse(content);

    var contentMetaFileName = utils.getMetaFilePath(content.id);

    //Création fichier content
    if(content.fileName && content.type == 'img'){
      var contentFileName = utils.getDataFilePath(content.fileName);

      fs.open(contentFileName, 'w+', (errFd, fd) => {
        if(errFd){ callback(errFd); }

        fs.writeFile(contentFileName, content.data.toString(), function(err){
          fs.close(fd, callback(err));
        });
      });
    }

    //Création fichier meta
    fs.open(contentMetaFileName, 'w+', (errFd, fd) => {
      if(errFd){ callback(errFd); }

      content.data = undefined;
      fs.writeFile(contentMetaFileName, JSON.parse(content), function(err){
        fs.close(fd, callback(err));
      });
    });
  }

  static read(id, callback){
    var metaFileName = utils.getMetaFilePath(id);

    fs.readFile(metaFileName, function(err, content){
      if(err){ callback(err); }

      var contentModel = new ContentModel(JSON.parse(content.toString()));
      return contentModel;
    });
  }

  static update(content, callback){
    var metaFileName = utils.getMetaFilePath(content.id);

    fs.open(metaFileName, 'w+', (errFd, fd) => {
      if(errFd){ callback(errFd); }

      fs.writeFile(contentMetaFileName, JSON.parse(content), function(err){
        fs.close(fd, callback(err));
      });
    });

    if(content.type == "img" && content.data != null && content.data.length > 0) {
      var contentFileName = utils.getDataFilePath(content.fileName);

      fs.open(contentFileName, 'w+', (errFd, fd) => {
        if(errFd){ callback(errFd); }

        fs.writeFile(contentMetaFileName, content.data, function(err){
          fs.close(fd, callback(err));
        });
      });
    }
  }

  static delete(id, callback){
    var metaFileName = utils.getMetaFilePath(id);

    fs.readFile(metaFileName, function(err,fileContent){
      if(err){ callback(err); }

      var content = JSON.parse(fileContent.toString());
      fs.unlink(utils.getDataFilePath(content.fileName), callback(err));
    });

    fs.unlink(metaFileName, callback(err));
  }

}
module.exports = ContentModel;
