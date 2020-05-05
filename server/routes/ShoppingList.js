const express = require("express")
const shoppingList = express.Router()
const cors = require("cors")
const db = require("../database/db.js")
const sequelize = require("sequelize")
shoppingList.use(cors())
const ListeCourse = require("../models/ListeCourses")

//ajouter à la liste de course
shoppingList.post('/add', (req, res) => {

    for (let i = 0; i < req.body.listIngredients.length; i++) {


        const listeCourseData = {
            pseudo: req.body.pseudo,
            idIngredient: req.body.listIngredients[i].idIngredient
        }
        ListeCourse.findOne({
            where: {
                pseudo: req.body.pseudo,
                idIngredient: req.body.listIngredients[i].idIngredient
            }
        })
            .then(listeCourse => {
                if (!listeCourse) {
                    ListeCourse.create(listeCourseData)
                }
            })
    }
})

//récupérer la liste de courses de l'utilisateur
shoppingList.get('/:pseudo', (req, res) => {
    db.sequelize.query("SELECT ingredient.* FROM ingredient INNER JOIN liste_de_courses WHERE liste_de_courses.idIngredient = ingredient.idIngredient AND liste_de_courses.pseudo = ? ORDER BY ingredient.nomIngredient", {
        replacements: [req.params.pseudo],
        type: sequelize.QueryTypes.SELECT
    }).then(resultats => {
        res.json(resultats)
    }).catch(err => {
        res.json({ error: err })
    })
})

//récupérer les ingrédients non présents dans la liste de courses de l'utilisateur
shoppingList.get('/rest/:pseudo', (req, res) => {
    db.sequelize.query("SELECT ingredient.* FROM ingredient WHERE ingredient.idIngredient NOT IN (SELECT ingredient.idIngredient FROM ingredient INNER JOIN liste_de_courses WHERE liste_de_courses.idIngredient = ingredient.idIngredient AND liste_de_courses.pseudo = ?) ORDER BY ingredient.nomIngredient", {
        replacements: [req.params.pseudo],
        type: sequelize.QueryTypes.SELECT
    }).then(resultats => {
        res.json(resultats)
    }).catch(err => {
        res.json({ error: err })
    })
})

shoppingList.post('/add/ingredient', (req, res) => {
    const listeCourseData = {
        pseudo: req.body.pseudo,
        idIngredient: req.body.idIngredient
    }
    ListeCourse.create(listeCourseData)
        .then(() => {
            res.send('Ingredient added!')
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})


//supprimer un ingredient de la liste de course
shoppingList.delete('/delete/:id/:pseudo', (req, res) => {
    ListeCourse.destroy({
        where: {
            idIngredient: req.params.id,
            pseudo: req.params.pseudo
        }
    })
        .then(() => {
            res.send('Ingredient deleted!')
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = shoppingList