const express = require("express")
const statistique = express.Router()
const cors = require("cors")
const db = require("../database/db.js")
const sequelize = require("sequelize")
statistique.use(cors())

//Récupérer le nb de vues tot
statistique.get('/nbVuesTot', (req, res) => {

    let query = db.sequelize.query("select sum(r.nbVues) nbVuesTot from recettes r", {
        type: sequelize.QueryTypes.SELECT
    })
    query.then(resultats => {
            res.json(resultats)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = statistique