const express = require("express")
const categ = express.Router()
const cors = require("cors")
const db = require("../database/db.js")
const sequelize = require("sequelize")
categ.use(cors())
const Categorie = require("../models/Categorie")

//Récupérer toutes les catégories
categ.get('', (req, res) => {
    Categorie.findAll({

    })
        .then(categorie => {
            if (categorie) {

                res.json(categorie)
            } else {
                res.send("Il n'y a pas de categorie.")
            }

        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer les catégories d'une recette
categ.get('/recipe/:idRecette', (req, res) => {

    let query = db.sequelize.query("SELECT * FROM categories, classerDans WHERE categories.idCategorie = classerDans.idCategorie AND classerDans.idRecette = ?", {
        replacements: [req.params.idRecette],
        type: sequelize.QueryTypes.SELECT
    })
    query.then(resultats => {
        res.json(resultats)
    })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//supprimer categorie
categ.delete('/delete/:id', (req, res) => {
    Categorie.destroy({
        where: {
            idCategorie: req.params.id
        }
    })
        .then(() => {
            res.send('Category deleted!')
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//modifier catégorie
categ.put('/update', (req, res) => {
    Categorie.findOne({
        where: {
            libelleCategorie: req.body.libelleCategorie
        }
    }).then((categorie) => {

        if (!categorie) {
            Categorie.update({ libelleCategorie: req.sanitize(req.body.libelleCategorie) }, { where: { idCategorie: req.body.idCategorie } })
                .then(() => {
                    res.json({ success: 'Libellé categorie modifié !' })
                })
                .error(err =>
                    res.json({ error: err }))
        }
    })
        .error(err =>
            res.json({ error: err }))
})

//Ajouter catégorie  
categ.post('/add', (req, res) => {

    const categorieData = {
        libelleCategorie: req.sanitize(req.body.libelleCategorie),

    }
    Categorie.findOne({
        where: {
            libelleCategorie: req.sanitize(req.body.libelleCategorie)
        }
    })
        .then(categorie => {
            if (!categorie) {
                Categorie.create(categorieData)
                    .then(success => {
                        res.json({ success: "Catégorie ajoutée avec succès !" })
                    })
                    .catch(err => {
                        res.json({ error: err })
                    })

            } else {
                res.json({ error: "Cette categorie existe déjà" })
            }
        })
        .catch(err => {
            res.json({ error: err })
        })
})

//selectionner que les catégories dont une recette ne fait pas partie
categ.get('/rest/recipe/:idRecette', (req, res) => {
    db.sequelize.query("SELECT * FROM categories WHERE categories.idCategorie NOT IN (SELECT categories.idCategorie FROM recettes INNER JOIN classerDans INNER JOIN categories WHERE recettes.idRecette = classerDans.idRecette AND classerDans.idCategorie = categories.idCategorie AND recettes.idRecette = ?)", {
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

module.exports = categ