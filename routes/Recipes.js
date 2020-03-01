const express = require("express")
const recipe = express.Router()
const cors = require("cors")
const db = require("../database/db.js")
const sequelize = require("sequelize")
const Recipe = require("../models/Recipe")
const UtiliserIngredients = require("../models/UtiliserIngredients")
const Ingredient = require("../models/Ingredient")
const Unite = require("../models/Unite")
const Categorie = require("../models/Categorie")
recipe.use(cors())

//Récupérer toutes les recettes
recipe.get('/allRecipes', (req, res) => {
    Recipe.findAll({

    })
        .then(recipes => {
            if(recipes){
                res.json(recipes)
            }else{
                res.send("Il n'y a pas de recettes")
            }
           
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer la recette depuis son identifiant
recipe.get('/recipe/:id', (req, res) => {
    Recipe.findOne({
        where: {
            idRecette: req.params.id
        }
    })
        .then(recipe => {
            if(recipe) {
                res.json(recipe)
            } else {
                res.send("Mauvais identifiant")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//recupérer ingrédients de la recette avec l'id de la recette
recipe.get('/recipe/:id/ingredients', (req, res) => {

    let query = db.sequelize.query("SELECT ingredient.nomIngredient, utiliserIngredients.qte, unites.libelleUnite FROM ingredient INNER JOIN recettes INNER JOIN utiliserIngredients INNER JOIN unites WHERE ingredient.idIngredient = utiliserIngredients.idIngredient AND utiliserIngredients.idRecette = ? AND utiliserIngredients.idRecette = recettes.idRecette AND unites.idUnite = utiliserIngredients.idUnite",
    {
      replacements: [req.params.id],
      type: sequelize.QueryTypes.SELECT
    })
    query.then(resultats => {
            console.log(resultats)
            res.json(resultats)
        }) 
        .catch(err => {
            res.send('error: ' + err)
        })
    }

)


//recuper ingredient par son id
recipe.get('/recipe/ingredient/:id', (req, res) => {
    Ingredient.findAll({
        where: {
            idIngredient: req.params.id
        }
    })
        .then(ingredient => {
            res.json(ingredient)
        }) 
        .catch(err => {
            res.send('error: ' + err)
        })
    }
)

//recuperer unité par son id
recipe.get('/recipe/unite/:id', (req, res) => {
    Unite.findAll({
        where: {
            idUnite: req.params.id
        }
    })
        .then(unite => {
            res.json(unite)
        }) 
        .catch(err => {
            res.send('error: ' + err)
        })
    }
)


//Récupérer les 3 recettes les plus récentes 
recipe.get('/latestReceipes', (req, res) => {
    Recipe.findAll({
        order: [["datePublication", "DESC"]],
        limit: 3
    })
    .then(recipe => {
        if(recipe) {
            res.json(recipe)
        } else {
            res.send("Il n'y a pas de recettes")
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

//Récupérer les 3 recettes les plus vues
recipe.get('/mostPopularRecipes', (req, res) => {
    Recipe.findAll({
        order: [["nbVues", "DESC"]],
        limit: 3
    })
    .then(recipe => {
        if(recipe) {
            res.json(recipe)
        } else {
            res.send("Il n'y a pas de recettes")
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

//Récupérer toutes les catégories
recipe.get('/category', (req, res) => {
    Categorie.findAll({

    })
        .then(categorie => {
            if(categorie){
              
                res.json(categorie)
            }else{
                res.send("Il n'y a pas de categorie.")
            }
           
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer les recettes d'une catégorie
recipe.get('/recipe/category/:idCategorie', (req, res) => {

    let query = db.sequelize.query("SELECT recettes.* FROM recettes INNER JOIN categories INNER JOIN classerDans WHERE classerDans.idCategorie = categories.idCategorie AND classerDans.idRecette = recettes.idRecette AND categories.idCategorie = ?",
    {
      replacements: [req.params.idCategorie],
      type: sequelize.QueryTypes.SELECT
    })
    query.then(resultats => {
            res.json(resultats)
        }) 
        .catch(err => {
            res.send('error: ' + err)
        })
    }

)

//incrémenter le nbre de vue
recipe.put('/recipe/update-nbView/:idRecette', (req, res) => {
    Recipe.findOne(
        { where: {idRecette: req.params.idRecette}}
    )
    .then(recipe => {
        Recipe.update(
            { nbVues: recipe.nbVues + 1 },
            { where: { idRecette: req.params.idRecette } }
        )
        .then(() => {
            res.json({success : 'Nombre de vues incrémenté !'})
        })
        .error(err => 
            res.json({error : err}))
    })
})


//supprimer recette
recipe.delete('/delete-recipe/:id', (req, res) => {
    Recipe.destroy({
      where: {
        idRecette: req.params.id
      }
    })
      .then(() => {
          console.log('recipe deleted')
        res.send('Recipe deleted!')
      })
      .catch(err => {
        res.send('error: ' + err)
      })
})

module.exports = recipe