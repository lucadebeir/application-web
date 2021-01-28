const express = require("express");
const notification = express.Router();
const cors = require("cors");
const Notification = require("../models/Notification");
const db = require("../database/db.js");
const sequelize = require("sequelize");
notification.use(cors());

//obtenir toutes les notifications
notification.get("/allNotifs", (req, res) => {
  Notification.findAll({
    order: [["dateNotification", "DESC"]],
  })
    .then((notifs) => {
      if (notifs) {
        res.json(notifs);
      } else {
        res.send("Il n'y a pas de notifs");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//obtenir toutes les notifications quand enable = true
notification.get("/notifs/enabled", (req, res) => {
  db.sequelize
    .query("SELECT * from notifications where enabled = true", {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((notifs) => {
      if (notifs) {
        res.json(notifs);
      } else {
        res.send("Il n'y a pas de notifs");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//ajouter une notification
notification.post("/add", (req, res) => {
  console.log(req);
  const notification = {
    type: req.body.type,
    pseudo: req.body.pseudo,
    idRecette: req.body.idRecette,
  };
  console.log(notification);
  Notification.create(notification)
    .then((resultats) => {
      console.log(resultats);
      res.json(resultats);
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

notification.put("/update/:idNotif", (req, res) => {
  db.sequelize
    .query(
      "UPDATE notifications set enabled = false where notifications.idNotification = ?",
      {
        replacements: [req.params.idNotif],
        type: sequelize.QueryTypes.UPDATE,
      }
    )
    .then((resultats) => {
      res.json({ success: "Notification modifiée" });
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});
module.exports = notification;
