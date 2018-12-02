"use strict";

var Socket = require('socket.io');

const  availableCommands = ["START" , "PAUSE" , "END" , "BEGIN" , "PREV", "NEXT"];

class IOController {

    /*
    {
      "CMD": [START | PAUSE | END | BEGIN | PREV | NEXT ],
      "PRES_ID": [pres.id],
    }
    */

  listen(httpServer)
  {
      var IO = new Socket(httpServer);
      var connections = new Map();

      IO.on('connection', function(client) {
          console.log('Client connected...');
          client.emit('connection');

          client.on('data_comm', function(data) {
              console.log('Client data_comm');
              connections.set(data.id, client);
          });

          client.on('slidEvent', function(data) {
              console.log('Client slidEvent');
              console.log(data);

              // en fonction de la commande et de la presentation en cours
              // renvoyer le contenu de la slide aux clients connectés

              var content = {
                id: '63cd3d02-a104-4725-b5dd-c55d6a7550af',
                title:'La creuse',
                type: 'img_url',
                src : 'https://www.detoursenfrance.fr/sites/art-de-vivre/files/styles/large/public/la-creuse-village-gargilesse-dampierre_0.jpg?itok=Bfg8x7Pd'
              };
              // TODO récupérer content de la présentation

              connections.forEach(function(clt){
                clt.emit('currentSlidEvent',content);
              });

          });
      });
  }

}

module.exports = new IOController();
