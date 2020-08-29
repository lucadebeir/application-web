const express = require("express")
const recipeList = express.Router()
const cors = require("cors")
const db = require("../database/db.js")
const sequelize = require("sequelize")
const RecipeList = require("../models/RecipeList")
const Recipe = require("../models/Recipe")
recipeList.use(cors())

//récupérer le recipeList du moment
recipeList.get('/:pseudo', (req, res) => {
    RecipeList.findAll({
            where: {
                pseudoUser: req.params.pseudo
            }
        })
        .then(recipeList => {
            if (recipeList) {
                res.json(recipeList)
            } else {
                res.send("Pas de recettes disponibles dans la liste")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

recipeList.put('/update-nbView/:idRecette', (req, res) => {
    Recipe.findOne({
            where: {
                idRecette: req.params.idRecette
            }
        })
        .then(recipe => {
            if (recipe) {
                Recipe.update({ nbVues: recipe.nbVues + 1 }, { where: { idRecette: recipe.idRecette } })
                    .then(() => {
                        res.json({ success: 'Nombre de vues incrémenté !' })
                    })
                    .error(err =>
                        res.json({ error: err })
                    )
            } else {
                res.send("Mauvais identifiant")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//ajout d'une recette à la liste
recipeList.post('/add', (req, res) => {
    db.sequelize.query("INSERT INTO `recipeLists` (`idRecipeList`, `nomRecette`, `pseudoUser`, `idRecette`) VALUES (NULL, ?, ?, ?)", {
            replacements: [req.sanitize(req.body.nomRecette), req.sanitize(req.body.pseudoUser), req.sanitize(req.body.idRecette)],
            type: sequelize.QueryTypes.CREATE
        })
        .then(() => {
            res.json({ success: 'Recette ajoutée à la liste!' })
        })
        .error(err =>
            res.json({ error: err }))
})

//suppression d'une recette de la liste
recipeList.post('/delete', (req, res) => {
    RecipeList.destroy({
            where: {
                idRecipeList: req.body.idRecipeList
            }
        })
        .then(() => {
            res.json({ success: 'Recette supprimée à la liste!' })
        })
        .error(err =>
            res.json({ error: err }))
})

//suppression de toutes les recettes de la liste
recipeList.post('/delete/all', (req, res) => {
    console.log(req.body)
    RecipeList.destroy({
            where: {
                pseudoUser: req.body.pseudoUser
            },
            truncate: true
        })
        .then(() => {
            res.json({ success: 'Recette supprimée à la liste!' })
        })
        .error(err =>
            res.json({ error: err }))
})

//update état d'une recette de la liste
recipeList.post('/update', (req, res) => {
    db.sequelize.query("UPDATE recipeLists SET complet = ? WHERE idRecipeList = ?", {
            replacements: [req.body.complet, req.body.idRecipeList],
            type: sequelize.QueryTypes.UPDATE
        })
        .then(() => {
            res.json({ success: 'Recette modifiée à la liste!' })
        })
        .error(err =>
            res.json({ error: err }))
})

module.exports = recipeList