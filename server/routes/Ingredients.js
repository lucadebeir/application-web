const express = require("express")
const ingredient = express.Router()
const cors = require("cors")
const db = require("../database/db.js")
const sequelize = require("sequelize")
const Ingredient = require("../models/Ingredient")
ingredient.use(cors())

//Récupérer tous les ingrédients dans l'ordre alphabétique
ingredient.get('', (req, res) => {
    Ingredient.findAll({
        order: [
            ["nomIngredient", "ASC"]
        ],
    })
        .then(ingredient => {
            if (ingredient) {

                res.json(ingredient)
            } else {
                res.send("Il n'y a pas d'ingrédient'.")
            }

        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer tous les infos de l'ingrédient
ingredient.get('/:idIngredient', (req, res) => {
    Ingredient.findOne({
        where: {
            idIngredient: req.params.idIngredient
        },
    })
        .then(ingredient => {
            if (ingredient) {

                res.json(ingredient)
            } else {
                res.send("Il n'y a pas d'ingrédient'.")
            }

        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer tous les ingrédients restants dans l'ordre alphabétique
ingredient.get('/rest', (req, res) => {
    db.sequelize.query("SELECT * FROM ingredient WHERE idIngredient NOT IN (" + req.sanitize(req.query.ingredients) + ")", {
        order: ["nomIngredient", "ASC"]
    })
        .then(ingredient => {
            if (ingredient) {
                res.json(ingredient[0])
            } else {
                res.send("Il n'y a pas d'ingrédient'.")
            }

        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//supprimer ingredient
ingredient.delete('/delete/:id', (req, res) => {
    Ingredient.destroy({
        where: {
            idIngredient: req.params.id
        }
    })
        .then(() => {
            res.send('Ingredient deleted!')
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//modifier ingredient
ingredient.put('/update', (req, res) => {
    Ingredient.findOne({
        where: {
            nomIngredient: req.body.nomIngredient
        }
    }).then((ingredient) => {

        if (!ingredient) {
            Ingredient.update({ nomIngredient: req.sanitize(req.body.nomIngredient) }, { where: { idIngredient: req.body.idIngredient } })
                .then(() => {
                    res.json({ success: 'Ingrédient modifié !' })
                })
                .error(err =>
                    res.json({ error: err }))
        }
    })
        .error(err =>
            res.json({ error: err }))
})

//Ajouter ingredient 
ingredient.post('/add', (req, res) => {

    const ingredientData = {
        nomIngredient: req.sanitize(req.body.nomIngredient),

    }
    Ingredient.findOne({
        where: {
            nomIngredient: req.sanitize(req.body.nomIngredient)
        }
    })
        .then(ingredient => {
            if (!ingredient) {

                Ingredient.create(ingredientData)
                    .then(success => {
                        res.json({ success: "Ingredient ajouté avec succès !" })
                    })
                    .catch(err => {
                        res.json({ error: err })
                    })

            } else {
                res.json({ error: "Cet ingrédient existe déjà" })
            }
        })
        .catch(err => {
            res.json({ error: err })
        })
})

//Récupérer les ingrédients qui ne sont pas utilisés dans une recette
ingredient.get('/recipe/:idRecette/rest', (req, res) => {
    db.sequelize.query("SELECT * FROM ingredient WHERE ingredient.idIngredient NOT IN (SELECT ingredient.idIngredient FROM ingredient INNER JOIN recettes INNER JOIN utiliserIngredients INNER JOIN unites WHERE ingredient.idIngredient = utiliserIngredients.idIngredient AND utiliserIngredients.idRecette = ? AND utiliserIngredients.idRecette = recettes.idRecette AND unites.idUnite = utiliserIngredients.idUnite) ORDER BY nomIngredient", {
        replacements: [req.params.idRecette],
        type: sequelize.QueryTypes.SELECT
    })
        .then(resultats => {
            res.json(resultats)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = ingredient