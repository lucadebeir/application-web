const express = require("express")
const utiliserIngredients = express.Router()
const cors = require("cors")
const UtiliserIngredients = require("../models/UtiliserIngredients")
utiliserIngredients.use(cors())

//supprimer un ingrédient d'une recette
utiliserIngredients.delete('/:idRecette/ingredient/:idIngredient/delete', (req, res) => {
    UtiliserIngredients.destroy({
        where: {
            idRecette: req.params.idRecette,
            idIngredient: req.params.idIngredient
        }
    })
        .then(() => {
            res.send('Ingredient deleted!')
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//modifier qte et unite d'un ingredient dans une recette
utiliserIngredients.put('/:idRecette/ingredient/update', (req, res) => {
    UtiliserIngredients.update({
        qte: req.body.qte,
        idUnite: req.body.idUnite
    }, {
        where: {
            idRecette: req.params.idRecette,
            idIngredient: req.body.idIngredient
        }
    })
        .then(() => {
            res.json({ success: 'Unité modifié !' })
        })
        .error(err =>
            res.json({ error: err }))
})

//ajouter un ingrédient à une recette
utiliserIngredients.post(`/:idRecette/add/ingredient/:idIngredient`, (req, res) => {

    UtiliserIngredients.create(req.body)
        .then((res) => {
            res.json(res)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = utiliserIngredients