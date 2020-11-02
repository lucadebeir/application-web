const express = require("express")
const notification = express.Router()
const cors = require("cors")
const Notification = require("../models/Notification")
notification.use(cors())

//obtenir toutes les notifications
notification.get('/allNotifs', (req, res) => {
    Notification.findAll({
            order: [
                ["dateNotification", "DESC"]
            ]
        })
        .then(notifs => {
            if (notifs) {
                res.json(notifs)
            } else {
                res.send("Il n'y a pas de notifs")
            }

        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//ajouter une notification
notification.post('/add', (req, res) => {
    const notification = {
        type: req.body.type,
        dateNotification: new Date(),
        pseudo: req.body.pseudo,
        idRecette: req.body.idRecette
    }

    Notification.create(notification)
        .then(resultats => {
            res.json(resultats)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = notification