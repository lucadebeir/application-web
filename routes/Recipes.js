const express = require("express")
const recipes = express.Router()
const cors = require("cors")

const Recipe = require("../models/Recipe")
recipes.use(cors())

process.env.SECRET_KEY = 'secret'

//Récupérer toutes les recettes
recipes.get('/allRecipes', (req, res) => {
   

    User.findAll({

    })
        .then(recipe => {
            if(recipes){
                res.json(recipe)
            }else{
                res.send("Il n'y a pas de recettes")
            }
           
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = recipes