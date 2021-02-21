const express = require("express");
const menu = express.Router();
const cors = require("cors");
const db = require("../database/db.js");
const sequelize = require("sequelize");
const Menu = require("../models/Menu");
const Recipe = require("../models/Recipe");
menu.use(cors());

//récupérer le menu du moment
menu.get("/recipe", (req, res) => {
  db.sequelize
    .query(
      "SELECT idMenu, recettes.* FROM menus INNER JOIN recettes ON menus.idRecette = recettes.idRecette"
    )
    .then((menu) => {
      if (menu) {
        res.json(menu[0]);
      } else {
        res.send("Pas de recettes disponibles dans le menu");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Récupérer toutes les recettes classées alphabatiquement pour le menu
menu.get("/allRecipes", (req, res) => {
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

//récupérer le petit dejeuner du moment
menu.get("/", (req, res) => {
  db.sequelize
    .query(
      "SELECT recettes.*, images.*, menus.idMenu FROM menus, recettes, images, illustrerRecettes WHERE menus.idMenu IN (1, 2, 3) AND menus.idRecette = recettes.idRecette and illustrerRecettes.idImage = images.idImage and illustrerRecettes.idRecette = recettes.idRecette"
    )
    .then((menu) => {
      if (menu) {
        res.json(menu[0]);
      } else {
        res.send("Pas de petit déjeuner disponibles dans le menu");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//récupérer le petit dejeuner du moment
menu.get("/petitDej", (req, res) => {
  db.sequelize
    .query(
      "SELECT recettes.*, images.* FROM menus, recettes, images, illustrerRecettes WHERE menus.idMenu = 1 AND menus.idRecette = recettes.idRecette and illustrerRecettes.idImage = images.idImage and illustrerRecettes.idRecette = recettes.idRecette"
    )
    .then((menu) => {
      if (menu) {
        res.json(menu[0]);
      } else {
        res.send("Pas de petit déjeuner disponibles dans le menu");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//récupérer le petit dejeuner du moment
menu.get("/repas", (req, res) => {
  db.sequelize
    .query(
      "SELECT recettes.*, images.* FROM menus, recettes, images, illustrerRecettes WHERE menus.idMenu = 2 AND menus.idRecette = recettes.idRecette and illustrerRecettes.idImage = images.idImage and illustrerRecettes.idRecette = recettes.idRecette"
    )
    .then((menu) => {
      if (menu) {
        res.json(menu[0]);
      } else {
        res.send("Pas de repas disponibles dans le menu");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//récupérer le petit dejeuner du moment
menu.get("/douceur", (req, res) => {
  db.sequelize
    .query(
      "SELECT recettes.*, images.* FROM menus, recettes, images, illustrerRecettes WHERE menus.idMenu = 3 AND menus.idRecette = recettes.idRecette and illustrerRecettes.idImage = images.idImage and illustrerRecettes.idRecette = recettes.idRecette"
    )
    .then((menu) => {
      if (menu) {
        res.json(menu[0]);
      } else {
        res.send("Pas de douceur disponibles dans le menu");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

menu.post("/petitDej/update", (req, res) => {
  db.sequelize
    .query("UPDATE menus SET idRecette = ?  WHERE idMenu = 1", {
      replacements: [req.sanitize(req.body.idRecette)],
      type: sequelize.QueryTypes.UPDATE,
    })
    .then(() => {
      res.json({ success: "Petit déjeuner du moment modifié !" });
    })
    .error((err) => res.json({ error: err }));
});
menu.post("/repas/update", (req, res) => {
  db.sequelize
    .query("UPDATE menus SET idRecette = ?  WHERE idMenu = 2", {
      replacements: [req.sanitize(req.body.idRecette)],
      type: sequelize.QueryTypes.UPDATE,
    })
    .then(() => {
      res.json({ success: "Repas du moment modifié !" });
    })
    .error((err) => res.json({ error: err }));
});

menu.post("/douceur/update", (req, res) => {
  db.sequelize
    .query("UPDATE menus SET idRecette = ?  WHERE idMenu = 3", {
      replacements: [req.sanitize(req.body.idRecette)],
      type: sequelize.QueryTypes.UPDATE,
    })
    .then(() => {
      res.json({ success: "Douceur du moment modifié !" });
    })
    .error((err) => res.json({ error: err }));
});

module.exports = menu;
