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
    Recipe.update(
        { nbVues: req.body.nbVues + 1 },
        { where: { idRecette: req.params.idRecette } }
    )
        .then(() => {
            res.json({success : 'Nombre de vues incrémenté !'})
        })
        .error(err => 
            res.json({error : err}))
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

//supprimer categorie
recipe.delete('/category/delete/:id', (req, res) => {
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
recipe.put('/category/update', (req, res) => {
    Categorie.findOne({
        where: {
            libelleCategorie: req.body.libelleCategorie
        }
    }).then((categorie) => {
        console.log(categorie)
        if(!categorie) {
            Categorie.update(
                { libelleCategorie: req.sanitize(req.body.libelleCategorie) },
                { where: { idCategorie: req.body.idCategorie } }
            )
            .then(() => {
                res.json({success : 'Libellé categorie modifié !'})
            })
            .error(err => 
                res.json({error : err}))
        }
    })
    .error(err =>
        res.json({error: err}))
})

//Ajouter catégorie  
recipe.post('/category/add', (req, res) => { 
    console.log(req)
    const categorieData = {
       libelleCategorie: req.sanitize(req.body.libelleCategorie),

    }
    Categorie.findOne({ 
        where: {
            libelleCategorie: req.sanitize(req.body.libelleCategorie)
        }
    })
        .then(categorie => {
            if(!categorie) {
                    Categorie.create(categorieData) 
                    .then(success => {
                        res.json({success : "Catégorie ajoutée avec succès !"})
                    })
                    .catch(err => {
                        res.json({error: err})
                    })
                
            } else {
                res.json({ error: "Cette categorie existe déjà" })
            }
        })
        .catch(err => {
            res.json({error:  err})
        })
})

//Récupérer tous les ingrédients dans l'ordre alphabétique
recipe.get('/ingredient', (req, res) => {
    Ingredient.findAll({
        order: [["nomIngredient", "ASC"]],
    })
        .then(ingredient => {
            if(ingredient){
              
                res.json(ingredient)
            }else{
                res.send("Il n'y a pas d'ingrédient'.")
            }
           
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//supprimer ingredient
recipe.delete('/ingredient/delete/:id', (req, res) => {
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
recipe.put('/ingredient/update', (req, res) => {
    Ingredient.findOne({
        where: {
            nomIngredient: req.body.nomIngredient
        }
    }).then((ingredient) => {
    
        if(!ingredient) {
            Ingredient.update(
                { nomIngredient: req.sanitize(req.body.nomIngredient) },
                { where: { idIngredient: req.body.idIngredient } }
            )
            .then(() => {
                res.json({success : 'Ingrédient modifié !'})
            })
            .error(err => 
                res.json({error : err}))
        }
    })
    .error(err =>
        res.json({error: err}))
})

//Ajouter ingredient 
recipe.post('/ingredient/add', (req, res) => { 
   
    const ingredientData = {
       nomIngredient: req.sanitize(req.body.nomIngredient),

    }
   Ingredient.findOne({ 
        where: {
            nomIngredient: req.sanitize(req.body.nomIngredient)
        }
    })
        .then(ingredient => {
            if(!ingredient) {
             
                    Ingredient.create(ingredientData) 
                    .then(success => {
                        res.json({success : "Ingredient ajoutée avec succès !"})
                    })
                    .catch(err => {
                        res.json({error: err})
                    })
                
            } else {
                res.json({ error: "Cet ingrédient existe déjà" })
            }
        })
        .catch(err => {
            res.json({error:  err})
        })
})

module.exports = recipe