const express = require("express");
const unite = express.Router();
const cors = require("cors");
const Unite = require("../models/Unite");
unite.use(cors());

//recuperer unité par son id
unite.get("/unite/:id", (req, res) => {
  Unite.findAll({
    where: {
      idUnite: req.params.id,
    },
  })
    .then((unite) => {
      res.json(unite);
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//récupérer toutes les unités dans l'ordre alphabetique
unite.get("", (req, res) => {
  Unite.findAll({
    order: [["libelleUnite", "ASC"]],
  })
    .then((unite) => {
      if (unite) {
        res.json(unite);
      } else {
        res.send("Il n'y a pas d'unité !");
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

//supprimer unité
unite.delete("/delete/:id", (req, res) => {
  Unite.destroy({
    where: {
      idUnite: req.params.id,
    },
  })
    .then(() => {
      res.json({ success: "Unite deleted!" });
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//modifier unité
unite.put("/update", (req, res) => {
  Unite.findOne({
    where: {
      libelleUnite: req.body.libelleUnite,
    },
  })
    .then((unite) => {
      if (!unite) {
        Unite.update(
          { libelleUnite: req.sanitize(req.body.libelleUnite) },
          { where: { idUnite: req.body.idUnite } }
        )
          .then(() => {
            res.json({ success: "Unité modifié !" });
          })
          .catch((err) => {
            res.send("error: " + err);
          });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Ajouter unite
unite.post("/add", (req, res) => {
  const uniteData = {
    libelleUnite: req.sanitize(req.body.libelleUnite),
  };
  Unite.findOne({
    where: {
      libelleUnite: req.sanitize(req.body.libelleUnite),
    },
  })
    .then((unite) => {
      if (!unite) {
        Unite.create(uniteData)
          .then((success) => {
            res.json({ success: "Unité ajoutée avec succès !" });
          })
          .catch((err) => {
            res.json({ error: err });
          });
      } else {
        res.json({ error: "Cet unité existe déjà" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

module.exports = unite;
