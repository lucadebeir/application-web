const express = require("express")
const statistique = express.Router()
const cors = require("cors")
const db = require("../database/db.js")
const sequelize = require("sequelize")
statistique.use(cors())

//Récupérer le nb de vues total
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

//Récupérer le commentaires de vues total
statistique.get('/nbCommentairesTot', (req, res) => {
    let query = db.sequelize.query("select count(*) nbCommentairesTot from commentaires", {
        type: sequelize.QueryTypes.SELECT
    })
    query.then(resultats => {
            res.json(resultats)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer le nb d'utilisateurs
statistique.get('/nbUsers', (req, res) => {
    let query = db.sequelize.query("select count(*) nbUsers from users", {
        type: sequelize.QueryTypes.SELECT
    })
    query.then(resultats => {
            res.json(resultats)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer le nb d'abonnée newsletter
statistique.get('/nbAbonnes', (req, res) => {
    let query = db.sequelize.query("select count(*) nbAbonnes from users where abonneNews = '1'", {
        type: sequelize.QueryTypes.SELECT
    })
    query.then(resultats => {
            res.json(resultats)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer les pseudo et si abbo
statistique.get('/users', (req, res) => {
    let query = db.sequelize.query("select pseudo,abonneNews from users", {
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