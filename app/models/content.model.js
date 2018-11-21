"use strict";

const utils = require("../utils/utils.js");
var fs = require("fs");
var CONFIG = JSON.parse(process.env.CONFIG);
var contentDirectory = CONFIG.contentDirectory;

class ContentModel {

  constructor(content) {
    if(content == undefined || content == null){
      this.id = null;
      this.type = null;
      this.title = null;
      this.src = null;
      this.fileName = null;
    }
    else {
      if(content.id)
        this.id = content.id;
      if(content.type)
        this.type = content.type;
      if(content.title)
        this.title = content.title;
      if(content.src)
        this.src = content.src;
      if(content.fileName)
        this.fileName  = content.fileName;
      //if(content.data)
        //this.data = content.data;
    }
  }

  getData(){
    return this.data;
  }

  setData(data){
    this.data = data;
  }

  static isContentModel(content){
    if(content.type == undefined || content.title == undefined || content.fileName == undefined)
      return false;
    else
      return true;
  }


  // Méthodes statiques

  static create(content, callback){

    if(content == null || content.id == null){
      callback(new Error("Le paramètre d'entrée ne doit as être null"));
      return;
    }

    if(!(content instanceof ContentModel) || !ContentModel.isContentModel(content)){
      callback(new Error("Le paramètre d'entrée doit être du type ContentModel"));
      return;
    }

    var contentMetaFileName = utils.getMetaFilePath(content.id);

    //Création fichier content
    if(content.fileName != undefined && content.type == 'img'){
      var contentFileName = utils.getDataFilePath(content.fileName);

      fs.open(contentFileName, 'w+', (errFd, fd) => {
        if(errFd){ callback(errFd); return; }

        fs.writeFile(contentFileName, content.data.toString(), function(err){
          if(errFd){ callback(err); return; }
          fs.close(fd, (err) => { callback(err); return; });
        });
      });
    }

    //Création fichier meta
    fs.open(contentMetaFileName, 'w+', (errFd, fd) => {
      if(errFd){ callback(errFd); return; }

      var dataToWrite = JSON.stringify(content,null, 4);
      fs.writeFile(contentMetaFileName, dataToWrite, function(err){
        if(errFd){ callback(err); }
        fs.close(fd, (err) => { callback(err); return; });
      });
    });
  }

  static read(id, callback){
    if(id == null){
      callback(new Error("id ne doit pas être null"));
      return;
    }

    var metaFileName = utils.getMetaFilePath(id);

    fs.readFile(metaFileName, 'utf8', function(err, content){
      if(err){ callback(err); return; }

      var jsonContent = JSON.parse(content.toString());
      var contentModel = new ContentModel(jsonContent);
      contentModel.setData(jsonContent.data);

      callback(null,contentModel);
    });
  }


  static update(content, callback){
    if(content == null || content.id == null){
      callback(new Error("id ne doit pas être null"));
      return;
    }

    var metaFileName = utils.getMetaFilePath(content.id);
    utils.fileExists(metaFileName, function(errFe){
      if(errFe != null){
        callback(new Error("Le fichier n'existe pas"));
        return;
      }
    });

    fs.open(metaFileName, 'w', (errFd, fd) => {
      if(errFd){ callback(errFd); return; }

      var contentToWrite = content;
      contentToWrite.data = content.getData();

      fs.writeFile(metaFileName, JSON.stringify(contentToWrite,null,2), function(err){
        fs.close(fd, callback);
      });
    });

    if(content.type == "img" && content.data != null && content.data.length > 0) {
      var contentFileName = utils.getDataFilePath(content.fileName);

      utils.fileExists(contentFileName, function(errFe){
        if(errFe){
          callback(new Error("Le fichier n'existe pas"));
          return;
        }
      });

      fs.open(contentFileName, 'w', (errFd, fd) => {
        if(errFd){ callback(errFd); return; }

        fs.writeFile(contentFileName, content.data, function(err){
          fs.close(fd, callback);
        });
      });
    }
  }


  static delete(id, callback){
    if(id == null){
      callback(new Error("id ne doit pas être null"));
      return;
    }

    var metaFileName = utils.getMetaFilePath(id);
    utils.fileExists(metaFileName, function(errFe){
      if(errFe){
        callback(new Error("Le fichier meta à supprimer n'existe pas"));
        return;
      }
    });

    fs.readFile(metaFileName, 'utf8', function(err,fileContent){
      if(err){ callback(err); return; }

      var content = JSON.parse(fileContent);
      var dataFilePath = utils.getDataFilePath(content.fileName);

      utils.fileExists(dataFilePath, function(errFe){
        if(errFe){
          callback(new Error("Le fichier data à supprimer n'existe pas"));
          return;
        }
      });
      fs.unlink(dataFilePath, callback);
      fs.unlink(metaFileName, callback);
    });
  }

}

module.exports = ContentModel;
