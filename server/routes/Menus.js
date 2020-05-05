const express = require("express")
const menu = express.Router()
const cors = require("cors")
const db = require("../database/db.js")
const sequelize = require("sequelize")
menu.use(cors())

//récupérer le menu du moment
menu.get('/recipe', (req, res) => {
    db.sequelize.query("SELECT idMenu, recettes.* FROM menus INNER JOIN recettes ON menus.idRecette = recettes.idRecette")
        .then(menu => {
            if(menu) {
                res.json(menu[0])
            } else {
                res.send("Pas de recettes disponibles dans le menu")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//récupérer le petit dejeuner du moment
menu.get('/petitDej', (req, res) => {
    db.sequelize.query("SELECT recettes.* FROM menus, recettes WHERE menus.idMenu = 1 AND menus.idRecette = recettes.idRecette")
        .then(menu => {
            if(menu) {
                res.json(menu[0])
            } else {
                res.send("Pas de petit déjeuner disponibles dans le menu")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//récupérer le petit dejeuner du moment
menu.get('/repas', (req, res) => {
    db.sequelize.query("SELECT recettes.* FROM menus, recettes WHERE menus.idMenu = 2 AND menus.idRecette = recettes.idRecette")
        .then(menu => {
            if(menu) {
                res.json(menu[0])
            } else {
                res.send("Pas de repas disponibles dans le menu")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//récupérer le petit dejeuner du moment
menu.get('/douceur', (req, res) => {
    db.sequelize.query("SELECT recettes.* FROM menus, recettes WHERE menus.idMenu = 3 AND menus.idRecette = recettes.idRecette")
        .then(menu => {
            if(menu) {
                res.json(menu[0])
            } else {
                res.send("Pas de douceur disponibles dans le menu")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = menu