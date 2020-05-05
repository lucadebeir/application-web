const express = require("express")
const classerDans = express.Router()
const cors = require("cors")
const ClasserDans = require("../models/ClasserDans")
classerDans.use(cors())

//supprimer une recette d'une catégorie
classerDans.delete('/recipe/:idRecette/category/:idCategorie/delete', (req, res) => {
    ClasserDans.destroy({
        where: {
            idRecette: req.params.idRecette,
            idCategorie: req.params.idCategorie
        }
    })
        .then((result) => {
            res.json(result)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//ajouter une catégorie à une recette
classerDans.post(`/recipe/:idRecette/category/add`, (req, res) => {
    const CategData = {
        idRecette: req.params.idRecette,
        idCategorie: req.body.idCategorie
    }
    ClasserDans.create(CategData)
        .then((result) => {
            console.log(result)
            res.json(result)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = classerDans