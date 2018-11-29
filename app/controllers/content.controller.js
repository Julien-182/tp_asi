"use strict";

const utils = require("../utils/utils.js");
const path = require('path');
var ContentModel = require("../models/content.model");
var fs = require("fs");
var CONFIG = JSON.parse(process.env.CONFIG);

class ContentController {

  constructor() {

  }

  list(req,res){

    fs.readdir(CONFIG.contentDirectory, function(err,files){
      if(err){
        res.writeHead(500);
        res.end(err.message);
      }

      var list = {};

      if(files.length == 0){
        res.writeHead(200);
        res.end(list);
      }

      files.forEach((file,index) => {
        if(file.endsWith(".meta.json")) {

          var fileContent = fs.readFileSync(CONFIG.contentDirectory + file);
          list[file.replace(".meta.json","")] = JSON.parse(fileContent.toString());

        }

        if(index == (files.length-1)){
          res.writeHead(200);
          res.end(JSON.stringify(list));
        }
      });

    });

  }

  read(req,res){
    var id = req.params.contentId;

    ContentModel.read(id, (err,data) => {
      if(err){
        res.writeHead(500);
        res.end(err.message);
        return;
      }
      
      if(req.query.json === 'true'){
        res.writeHead(200);
        res.end(JSON.stringify(data));
        return;
      }

      if(data.type === "img"){
        res.sendFile(CONFIG.contentDirectory + data.fileName);
      }
      else {
        res.writeHead(301,
          {Location: data.src}
        );
        res.end();
      }
    });
  }

  create(req,res){
    var contentModel = new ContentModel({});
    contentModel.id = utils.generateUUID();

    if(req.body.type)
      contentModel.type = req.body.type;
    if(req.body.title)
      contentModel.title = req.body.title;

    if(req.body.type != 'img') {
      if(req.body.type -= 'img_url') contentModel.src = req.body.src;
      else contentModel.src = "";

      contentModel.fileName = "";
      if(req.body.data)
        contentModel.setData(req.body.data);
    }
    else {
      var file = req.file;
      contentModel.src = "";
      contentModel.fileName = file.originalname;

      console.log(file);
      var fileContent = fs.readFileSync(file.path, {encoding: 'binary'});
      if(fileContent) contentModel.setData(fileContent.toString('binary'));
    }

    console.log(JSON.stringify(contentModel,null,4));
    ContentModel.create(contentModel, (err) => {
      if(err){
        res.writeHead(500);
        res.end(err.message);
        return;
      }
    });

    res.writeHead(201);
    res.end("Content created");
    return;

  }

  update(req,res){

  }

  remove(req,res){

  }

}

module.exports = new ContentController();
