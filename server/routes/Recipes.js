const express = require("express");
const recipe = express.Router();
const cors = require("cors");
const db = require("../database/db.js");
const sequelize = require("sequelize");
const Recipe = require("../models/Recipe");
recipe.use(cors());
var request = require("request");

var FCM = require("fcm-node");
var serverKey =
  "AAAA5n3DS64:APA91bEJm6xWRwuqA4LWGpu6RFS9xnO7169adBNdn01r6aaDgHXJft-7SRbQ-Gaue4tZFQkiBYo2oCJLMb23avUFNX7eecUr50xFKfybENcYeM3N6tXDZdQU083SPzV9_uZhppbhbFVt"; //put your server key here
var fcm = new FCM(serverKey);

var admin = require("firebase-admin");

var serviceAccount = require("../config/marine-s-recipes-firebase-adminsdk-2vvnn-cfe5e8aad9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
var topic = "/topics/all";

//Récupérer toutes les recettes
recipe.get("/allRecipes", (req, res) => {
  Recipe.findAll({
    order: [["datePublication", "DESC"]],
  })
    .then((recipes) => {
      if (recipes) {
        res.json(recipes);
      } else {
        res.send("Il n'y a pas de recettes");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Récupérer toutes les recettes dans l'ordre alphabétique
recipe.get("/allRecipes/asc", (req, res) => {
  Recipe.findAll({
    order: [["nomRecette", "ASC"]],
  })
    .then((recipes) => {
      if (recipes) {
        res.json(recipes);
      } else {
        res.send("Il n'y a pas de recettes");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Récupérer toutes les recettes dans l'ordre des plus vues
recipe.get("/allRecipes/nbVues/desc", (req, res) => {
  Recipe.findAll({
    order: [["nbVues", "DESC"]],
  })
    .then((recipe) => {
      if (recipe) {
        res.json(recipe);
      } else {
        res.send("Il n'y a pas de recettes");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Récupérer la recette depuis son identifiant
recipe.get("/get/:id", (req, res) => {
  Recipe.findOne({
    where: {
      idRecette: req.params.id,
    },
  })
    .then((recipe) => {
      if (recipe) {
        res.json(recipe);
      } else {
        res.send("Mauvais identifiant");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//recupérer ingrédients de la recette avec l'id de la recette
recipe.get("/:id/ingredients", (req, res) => {
  let query = db.sequelize.query(
    "SELECT ingredient.idIngredient, ingredient.nomIngredient, utiliserIngredients.qte, unites.libelleUnite FROM ingredient INNER JOIN recettes INNER JOIN utiliserIngredients INNER JOIN unites WHERE ingredient.idIngredient = utiliserIngredients.idIngredient AND utiliserIngredients.idRecette = ? AND utiliserIngredients.idRecette = recettes.idRecette AND unites.idUnite = utiliserIngredients.idUnite ORDER BY ingredient.nomIngredient",
    {
      replacements: [req.params.id],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  query
    .then((resultats) => {
      res.json(resultats);
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Récupérer les 3 recettes les plus récentes
recipe.get("/latestRecipes", (req, res) => {
  Recipe.findAll({
    order: [["datePublication", "DESC"]],
    limit: 3,
  })
    .then((recipe) => {
      if (recipe) {
        res.json(recipe);
      } else {
        res.send("Il n'y a pas de recettes");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Récupérer les 3 recettes les plus vues
recipe.get("/mostPopularRecipes", (req, res) => {
  Recipe.findAll({
    order: [["nbVues", "DESC"]],
    limit: 12,
  })
    .then((recipe) => {
      if (recipe) {
        res.json(recipe);
      } else {
        res.send("Il n'y a pas de recettes");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Récupérer les recettes d'une catégorie
recipe.get("/category/:idCategorie", (req, res) => {
  let query = db.sequelize.query(
    "SELECT recettes.* FROM recettes INNER JOIN categories INNER JOIN classerDans WHERE classerDans.idCategorie = categories.idCategorie AND classerDans.idRecette = recettes.idRecette AND categories.idCategorie = ? ORDER BY recettes.datePublication DESC",
    {
      replacements: [req.params.idCategorie],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  query
    .then((resultats) => {
      res.json(resultats);
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Récupérer les recettes d'une catégorie selon nbVue
recipe.get("/nbVues/category/:idCategorie", (req, res) => {
  let query = db.sequelize.query(
    "SELECT recettes.* FROM recettes INNER JOIN categories INNER JOIN classerDans WHERE classerDans.idCategorie = categories.idCategorie AND classerDans.idRecette = recettes.idRecette AND categories.idCategorie = ? ORDER BY recettes.nbVues DESC",
    {
      replacements: [req.params.idCategorie],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  query
    .then((resultats) => {
      res.json(resultats);
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//incrémenter le nbre de vue
recipe.put("/update-nbView/:idRecette", (req, res) => {
  Recipe.update(
    { nbVues: req.body.nbVues + 1 },
    { where: { idRecette: req.params.idRecette } }
  )
    .then(() => {
      res.json({ success: "Nombre de vues incrémenté !" });
    })
    .error((err) => res.json({ error: err }));
});

//supprimer recette
recipe.delete("/delete-recipe/:id", (req, res) => {
  Recipe.destroy({
    where: {
      idRecette: req.params.id,
    },
  })
    .then(() => {
      res.json({ success: "Recipe deleted!" });
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//creer recette
recipe.post("/add-recipe", (req, res) => {
  db.sequelize
    .query(
      "INSERT INTO recettes (idRecette, nomRecette, datePublication, nbFavoris, nbVues, etapes, nbrePart, libellePart, tempsPreparation, tempsCuisson, astuce, mot) VALUES (NULL, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?, ?) ",
      {
        replacements: [
          req.sanitize(req.body.nomRecette),
          new Date(),
          req.sanitize(req.body.etapes),
          req.sanitize(req.body.nbrePart),
          req.sanitize(req.body.libellePart),
          req.sanitize(req.body.tempsPreparation),
          req.sanitize(req.body.tempsCuisson),
          req.sanitize(req.body.astuce),
          req.sanitize(req.body.mot),
        ],
      }
    )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

//ajouter ingrédients et catégorie de la recette
recipe.post("/addIngredientAndCategorie", (req, res) => {
  for (let i = 0; i < req.body.categories.length; i++) {
    db.sequelize.query(
      "INSERT INTO classerDans (idRecette, idCategorie) VALUES (?,?)",
      {
        replacements: [req.body.idRecette, req.body.categories[i].idCategorie],
      }
    );
  }
  console.log(req.body);
  for (let i = 0; i < req.body.ingredients.length; i++) {
    db.sequelize.query(
      "INSERT INTO utiliserIngredients (qte, idRecette, idIngredient, idUnite) VALUES (?,?,?,?)",
      {
        replacements: [
          req.body.ingredients[i].qte,
          req.body.idRecette,
          req.body.ingredients[i].idIngredient,
          req.body.ingredients[i].idUnite,
        ],
      }
    );
  }
  db.sequelize
    .query(
      "INSERT INTO `illustrerRecettes` (`idRecette`, `idImage`) VALUES (?, ?)",
      {
        replacements: [req.body.idRecette, req.body.idImage],
      }
    )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ error: err });
    });

  sendMessageToUser(req.body.nomRecette, req.body.mot, req.body.lienImage);
});

function sendMessageToUser(title, message, image) {
  console.log(image);
  request(
    {
      url: "https://fcm.googleapis.com/fcm/send",
      method: "POST",
      headers: {
        "Content-Type": " application/json",
        Authorization: "key=" + serverKey,
      },
      body: JSON.stringify({
        notification: {
          title: decodeURI(decodeURIComponent(title)),
          body: decodeURI(decodeURIComponent(message)),
          image: image,
        },
        to: "/topics/all",
        priority: "high",
      }),
    },
    function (error, response, body) {
      if (error) {
        console.error(error, response, body);
      } else if (response.statusCode >= 400) {
        console.error(
          "HTTP Error: " +
            response.statusCode +
            " - " +
            response.statusMessage +
            "\n" +
            body
        );
      } else {
        console.log("Done!");
      }
    }
  );
}

//modifier nom recette
recipe.put("/name/update", (req, res) => {
  Recipe.update(
    { nomRecette: req.sanitize(req.body.nomRecette) },
    { where: { idRecette: req.body.idRecette } }
  )
    .then(() => {
      res.json({ success: "Nom modifié !" });
    })
    .error((err) => res.json({ error: err }));
});

//modifier étapes recette
recipe.put("/step/update", (req, res) => {
  Recipe.update(
    { etapes: req.sanitize(req.body.etapes) },
    { where: { idRecette: req.body.idRecette } }
  )
    .then(() => {
      res.json({ success: "Etapes modifié !" });
    })
    .error((err) => res.json({ error: err }));
});

//modifier astuce recette
recipe.put("/astuce/update", (req, res) => {
  if (req.body.astuce) {
    Recipe.update(
      { astuce: req.sanitize(req.body.astuce) },
      { where: { idRecette: req.body.idRecette } }
    )
      .then(() => {
        res.json({ success: "Astuce modifié !" });
      })
      .error((err) => res.json({ error: err }));
  } else {
    Recipe.update({ astuce: "" }, { where: { idRecette: req.body.idRecette } })
      .then(() => {
        res.json({ success: "Astuce modifié !" });
      })
      .error((err) => res.json({ error: err }));
  }
});

//modifier astuce recette
recipe.put("/description/update", (req, res) => {
  if (req.body.mot) {
    Recipe.update(
      { mot: req.sanitize(req.body.mot) },
      { where: { idRecette: req.body.idRecette } }
    )
      .then(() => {
        res.json({ success: "Description modifié !" });
      })
      .error((err) => res.json({ error: err }));
  } else {
    Recipe.update({ mot: "" }, { where: { idRecette: req.body.idRecette } })
      .then(() => {
        res.json({ success: "Description modifié !" });
      })
      .error((err) => res.json({ error: err }));
  }
});

//modifier temps recette
recipe.put("/temps/update", (req, res) => {
  Recipe.update(
    {
      tempsPreparation: req.sanitize(req.body.tempsPreparation),
      tempsCuisson: req.sanitize(req.body.tempsCuisson),
    },
    { where: { idRecette: req.body.idRecette } }
  )
    .then(() => {
      res.json({ success: "Temps préparation et cuisson modifié !" });
    })
    .error((err) => res.json({ error: err }));
});

//modifier part recette
recipe.put("/part/update", (req, res) => {
  Recipe.update(
    {
      nbrePart: req.sanitize(req.body.nbrePart),
      libellePart: req.sanitize(req.body.libellePart),
    },
    { where: { idRecette: req.body.idRecette } }
  )
    .then(() => {
      res.json({ success: "Nombre et libellé de part modifié !" });
    })
    .error((err) => res.json({ error: err }));
});

module.exports = recipe;
