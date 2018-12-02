# PowerPoint NodeJS Part

## Installation

Installer les dépendances.

`npm install`

Lancer le projet

`npm start`

Lancer les tests

`npm test`

## API

* Presentation
  * `/loadPres GET`

  Retourne la liste de toutes les présentations enregistrées avec leur détails.

  Exemple de format retourné :


  ```
  {
    "presentation_id1": {
      "attribut1": "...",
      "attribut2": "..."
    },
    "presentation_id2": {
      "attribut1": "...",
      "attribut2": "..."
    }
  }
  ```

  * `/savePres POST`

  Sauvegarde une présentation sur le serveur.
  Envoyer dans le body de la requête la présentation. Renvoie code 200 en cas de succès.


* Content

  * `/contents GET`

  Retourne la liste de tous les contents sur le serveur.

  Exemple de format retourné :

  ```
  {
    "55775c6d-8b41-4c36-91d5-3c1fa6ed35aa": {
      "id": "55775c6d-8b41-4c36-91d5-3c1fa6ed35aa",
      "type": "img_url",
      "title": "yeet",
      "src": "https://styles.redditmedia.com/t5_idiqu/styles/image_widget_ibxxcyly92u01.png",
      "fileName": ""
    },
    "63cd3d02-a104-4725-b5dd-c55d6a7550af": {
      "id": "63cd3d02-a104-4725-b5dd-c55d6a7550af",
      "type": "img",
      "title": "Image 19",
      "src": "",
      "fileName": "16px.png"
    }
  }
  ```

  * `/contents/:contentId GET`

  Retourne un objet content depuis son id.
    * soit retourne les données (content.getData())
    * soit effectue une redirection vers content.src dans le cas où les données ne sont pas stockées sur le serveur.
    * soit retourne les meta-datas (le content au format JSON) si on passe en paramètre json=true dans l'URL.

  * `/contents POST`

  Sauvegarde un content sur le serveur. Retourne code 201 en cas de succès.

  Pour passer un fichier, utiliser le champ `file`.

  * `/contents/:contentId PUT`

  Met à jour un content sur le serveur depuis son ID. Corps de la requête identique au POST.

  * `/contents/:contentID DELETE`

  Supprime un content du serveur à partir de son ID.


* Authentification

  * `/login POST`

  Authentifie un user en faisant appel aux WS du JEE. Envoyer les credentials avec les champs `user` et `password`
