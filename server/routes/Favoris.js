const express = require("express")
const favori = express.Router()
const cors = require("cors")
const db = require("../database/db.js")
const sequelize = require("sequelize")
const Favoris = require("../models/Favoris")
const Recipe = require("../models/Recipe")
favori.use(cors())

//ajouter aux favoris
favori.post('/add', (req, res) => {
    const favData = {
        pseudo: req.body.pseudo,
        idRecette: req.body.idRecette
    }

    Favoris.findOne({
        where: {
            idRecette: favData.idRecette,
            pseudo: favData.pseudo
        }
    })
        .then(favoris => {
            if (!favoris) {

                Recipe.findOne({
                    where: {
                        idRecette: favData.idRecette
                    }
                })
                    .then(recipe => {
                        Recipe.update({ nbFavoris: recipe.nbFavoris + 1 }, { where: { idRecette: favData.idRecette } })
                    })

                db.sequelize.query("INSERT INTO `favoris`(`pseudo`, `idRecette`) VALUES (?, ?)", {
                    replacements: [favData.pseudo, favData.idRecette],
                    type: sequelize.QueryTypes.INSERT
                })
                    .then(success => {
                        console.log(success)
                        res.json({ success: "Ajouté aux favoris !" })
                    })
                    .catch(err => {
                        res.json({ error: err })
                    })

            } else {
                res.json({ error: "Cette recette est déjà dans les favoris." })
            }
        })
        .catch(err => {
            res.json({ error: err })
        })
})

//récupérer les favoris de l'utilisateur
favori.get('/recipe/:pseudo', (req, res) => {
    db.sequelize.query("SELECT recettes.* FROM recettes INNER JOIN favoris WHERE recettes.idRecette = favoris.idRecette AND favoris.pseudo = ? ", {
        replacements: [req.params.pseudo],
        type: sequelize.QueryTypes.SELECT
    }).then(resultats => {
        res.json(resultats)
    }).catch(err => {
        res.json({ error: err })
    })
})

//récupérer les favoris de l'utilisateur selon une catégorie
favori.get('/recipe/:pseudo/:idCategorie', (req, res) => {
    db.sequelize.query("SELECT recettes.* FROM recettes INNER JOIN favoris INNER JOIN classerDans WHERE recettes.idRecette = favoris.idRecette AND recettes.idRecette = classerDans.idRecette AND classerDans.idCategorie = ? AND favoris.pseudo = ?", {
        replacements: [req.params.idCategorie, req.params.pseudo],
        type: sequelize.QueryTypes.SELECT
    }).then(resultats => {
        res.json(resultats)
    }).catch(err => {
        res.json({ error: err })
    })
})

//supprimer un favoris
favori.delete('/:pseudo/delete/:id', (req, res) => {
    Favoris.destroy({
        where: {
            idRecette: req.params.id,
            pseudo: req.params.pseudo
        }
    })
    Recipe.findOne({
        where: {
            idRecette: req.params.id
        }
    })
        .then(recipe => {
            Recipe.update({
                nbFavoris: recipe.nbFavoris - 1
            }, {
                where: {
                    idRecette: req.params.id
                }
            })
            res.json({ success: "Supprimé des favoris !" })
        })
    .catch(err => {
        res.send('error: ' + err)
    })
})

module.exports = favori