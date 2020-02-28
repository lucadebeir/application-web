const express = require("express")
const recipe = express.Router()
const cors = require("cors")

const Recipe = require("../models/Recipe")
recipe.use(cors())

//Récupérer toutes les recettes
recipe.get('/allRecipes', (req, res) => {
    Recipe.findAll({

    })
        .then(recipes => {
            if(recipes){
                console.log(recipes)
                res.json(recipes)
            }else{
                res.send("Il n'y a pas de recettes")
            }
           
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = recipe