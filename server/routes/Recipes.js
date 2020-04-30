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
const Favoris = require("../models/Favoris")
const ListeCourse = require("../models/ListeCourses")
const ClasserDans = require("../models/ClasserDans")
const IllustrerRecettes = require("../models/IllustrerRecette")
const Image = require("../models/Image")
const Commentaire = require("../models/Commentaire")
const Menu = require("../models/Menu")
recipe.use(cors())
const uploadImage = require('../helpers/helpers')
let multer = require('multer');

//Récupérer toutes les recettes
recipe.get('/allRecipes', (req, res) => {
    Recipe.findAll({

    })
        .then(recipes => {
            if (recipes) {
                res.json(recipes)
            } else {
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
            if (recipe) {
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

    let query = db.sequelize.query("SELECT ingredient.idIngredient, ingredient.nomIngredient, utiliserIngredients.qte, unites.libelleUnite FROM ingredient INNER JOIN recettes INNER JOIN utiliserIngredients INNER JOIN unites WHERE ingredient.idIngredient = utiliserIngredients.idIngredient AND utiliserIngredients.idRecette = ? AND utiliserIngredients.idRecette = recettes.idRecette AND unites.idUnite = utiliserIngredients.idUnite ORDER BY ingredient.nomIngredient", {
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
})

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
})


//Récupérer les 3 recettes les plus récentes 
recipe.get('/latestReceipes', (req, res) => {
    Recipe.findAll({
        order: [
            ["datePublication", "DESC"]
        ],
        limit: 3
    })
        .then(recipe => {
            if (recipe) {
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
        order: [
            ["nbVues", "DESC"]
        ],
        limit: 3
    })
        .then(recipe => {
            if (recipe) {
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

//Récupérer les recettes d'une catégorie
recipe.get('/recipe/category/:idCategorie', (req, res) => {

    let query = db.sequelize.query("SELECT recettes.* FROM recettes INNER JOIN categories INNER JOIN classerDans WHERE classerDans.idCategorie = categories.idCategorie AND classerDans.idRecette = recettes.idRecette AND categories.idCategorie = ?", {
        replacements: [req.params.idCategorie],
        type: sequelize.QueryTypes.SELECT
    })
    query.then(resultats => {
        res.json(resultats)
    })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer les catégories d'une recette
recipe.get('/category/recipe/:idRecette', (req, res) => {

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

//récupérer la/les catégorie(s) d'une recette
recipe.get('/recipe/:idRecette/category', (req, res) => {

    let query = db.sequelize.query("SELECT categories.* FROM recettes INNER JOIN classerDans INNER JOIN categories WHERE recettes.idRecette = classerDans.idRecette AND classerDans.idCategorie = categories.idCategorie AND recettes.idRecette = ?", {
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

//incrémenter le nbre de vue
recipe.put('/recipe/update-nbView/:idRecette', (req, res) => {
    console.log("cc")
    Recipe.update({ nbVues: req.body.nbVues + 1 }, { where: { idRecette: req.params.idRecette } })
        .then(() => {
            res.json({ success: 'Nombre de vues incrémenté !' })
        })
        .error(err =>
            res.json({ error: err }))
})


//supprimer recette
recipe.delete('/delete-recipe/:id', (req, res) => {
    Recipe.destroy({
        where: {
            idRecette: req.params.id
        }
    })
        .then(() => {

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
recipe.post('/category/add', (req, res) => {

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

//Récupérer tous les ingrédients dans l'ordre alphabétique
recipe.get('/ingredient', (req, res) => {
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
recipe.get('/ingredient/:idIngredient', (req, res) => {
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
recipe.get('/ingredient/rest', (req, res) => {
    db.sequelize.query("SELECT * FROM ingredient WHERE idIngredient NOT IN (" + req.sanitize(req.query.ingredients) + ")", {
        order: ["nomIngredient", "ASC"]
    })
        .then(ingredient => {
            if (ingredient) {
                console.log(ingredient[0])
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

//creer recette
recipe.post('/add-recipe', (req, res) => {
    db.sequelize.query("INSERT INTO recettes (idRecette, nomRecette, datePublication, nbFavoris, nbVues, etapes, nbrePart, libellePart, tempsPreparation, tempsCuisson, astuce) VALUES (NULL, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?) ", {
        replacements: [req.sanitize(req.body.nomRecette), new Date(), req.sanitize(req.body.etapes), req.sanitize(req.body.nbrePart), req.sanitize(req.body.libellePart),
        req.sanitize(req.body.tempsPreparation), req.sanitize(req.body.tempsCuisson), req.sanitize(req.body.astuce)
        ]
    })
        .then(result => {
            res.json(result)
        }).catch(err => {
            res.json({ error: err })
        })
})

//ajouter ingrédients et catégorie de la recette
recipe.post('/recipe/addIngredientAndCategorie', (req, res) => {
    for (let i = 0; i < req.body.categories.length; i++) {
        db.sequelize.query("INSERT INTO classerDans (idRecette, idCategorie) VALUES (?,?)", {
            replacements: [req.body.idRecette, req.body.categories[i].idCategorie]
        })
    }
    for (let i = 0; i < req.body.ingredients.length; i++) {
        db.sequelize.query("INSERT INTO utiliserIngredients (qte, idRecette, idIngredient, idUnite) VALUES (?,?,?,?)", {
            replacements: [req.body.ingredients[i].qte, req.body.idRecette, req.body.ingredients[i].idIngredient, req.body.ingredients[i].idUnite]
        })
    }
    db.sequelize.query("INSERT INTO `illustrerRecettes` (`idRecette`, `idImage`) VALUES (?, ?)", {
        replacements: [req.body.idRecette, req.body.idImage]
    })
        .then(result => {
            res.json(result)
        }).catch(err => {
            res.json({ error: err })
        })
})
//modifier qte et unite d'un ingredient dans une recette
recipe.put('/recipe/:idRecette/ingredient/update', (req, res) => {
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
//récupérer toutes les unités dans l'ordre alphabetique
recipe.get('/unite', (req, res) => {
    Unite.findAll({
        order: [
            ["libelleUnite", "ASC"]
        ],
    })
        .then(unite => {
            if (unite) {
                res.json(unite)
            } else {
                res.send("Il n'y a pas d'unité !")
            }
        })
        .catch(err => {
            res.json({ error: err })
        })
})

//supprimer unité
recipe.delete('/unite/delete/:id', (req, res) => {
    Unite.destroy({
        where: {
            idUnite: req.params.id
        }
    })
        .then(() => {
            res.send('Unite deleted!')
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//modifier unité
recipe.put('/unite/update', (req, res) => {
    Unite.findOne({
        where: {
            libelleUnite: req.body.libelleUnite
        }
    }).then((unite) => {

        if (!unite) {
            Unite.update({ libelleUnite: req.sanitize(req.body.libelleUnite) }, { where: { idUnite: req.body.idUnite } })
                .then(() => {
                    res.json({ success: 'Unité modifié !' })
                })
                .error(err =>
                    res.json({ error: err }))
        }
    })
        .error(err =>
            res.json({ error: err }))
})

//Ajouter unite
recipe.post('/unite/add', (req, res) => {

    const uniteData = {
        libelleUnite: req.sanitize(req.body.libelleUnite),

    }
    Unite.findOne({
        where: {
            libelleUnite: req.sanitize(req.body.libelleUnite)
        }
    })
        .then(unite => {
            if (!unite) {

                Unite.create(uniteData)
                    .then(success => {
                        res.json({ success: "Unité ajoutée avec succès !" })
                    })
                    .catch(err => {
                        res.json({ error: err })
                    })

            } else {
                res.json({ error: "Cet unité existe déjà" })
            }
        })
        .catch(err => {
            res.json({ error: err })
        })
})

//ajouter aux favoris
recipe.post('/favorites/add', (req, res) => {
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



//ajouter à la liste de course
recipe.post('/shoppingList/add', (req, res) => {

    console.log(req.body.listIngredients[0])

    for (let i = 0; i < req.body.listIngredients.length; i++) {


        const listeCourseData = {
            pseudo: req.body.pseudo,
            idIngredient: req.body.listIngredients[i].idIngredient
        }
        ListeCourse.findOne({
            where: {
                pseudo: req.body.pseudo,
                idIngredient: req.body.listIngredients[i].idIngredient
            }
        })
            .then(listeCourse => {
                if (!listeCourse) {
                    ListeCourse.create(listeCourseData)
                }
            })
    }
})


//récupérer les favoris de l'utilisateur
recipe.get('/recipe/favorites/:pseudo', (req, res) => {
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
recipe.get('/recipe/favorites/:pseudo/:idCategorie', (req, res) => {
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
recipe.delete('/favorites/:pseudo/delete/:id', (req, res) => {
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



//récupérer la liste de courses de l'utilisateur
recipe.get('/shoppingList/:pseudo', (req, res) => {
    db.sequelize.query("SELECT ingredient.* FROM ingredient INNER JOIN liste_de_courses WHERE liste_de_courses.idIngredient = ingredient.idIngredient AND liste_de_courses.pseudo = ? ORDER BY ingredient.nomIngredient", {
        replacements: [req.params.pseudo],
        type: sequelize.QueryTypes.SELECT
    }).then(resultats => {
        res.json(resultats)
    }).catch(err => {
        res.json({ error: err })
    })
})

//récupérer les ingrédients non présents dans la liste de courses de l'utilisateur
recipe.get('/shoppingList/rest/:pseudo', (req, res) => {
    db.sequelize.query("SELECT ingredient.* FROM ingredient WHERE ingredient.idIngredient NOT IN (SELECT ingredient.idIngredient FROM ingredient INNER JOIN liste_de_courses WHERE liste_de_courses.idIngredient = ingredient.idIngredient AND liste_de_courses.pseudo = ?) ORDER BY ingredient.nomIngredient", {
        replacements: [req.params.pseudo],
        type: sequelize.QueryTypes.SELECT
    }).then(resultats => {
        res.json(resultats)
    }).catch(err => {
        res.json({ error: err })
    })
})

recipe.post('/shoppingList/add/ingredient', (req, res) => {
    const listeCourseData = {
        pseudo: req.body.pseudo,
        idIngredient: req.body.idIngredient
    }
    ListeCourse.create(listeCourseData)
        .then(() => {
            res.send('Ingredient added!')
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})


//supprimer un ingredient de la liste de course
recipe.delete('/shoppingList/delete/:id/:pseudo', (req, res) => {
    ListeCourse.destroy({
        where: {
            idIngredient: req.params.id,
            pseudo: req.params.pseudo
        }
    })
        .then(() => {
            res.send('Ingredient deleted!')
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//modifier nom recette
recipe.put('/recipe/name/update', (req, res) => {
    Recipe.update({ nomRecette: req.sanitize(req.body.nomRecette) }, { where: { idRecette: req.body.idRecette } })
        .then(() => {
            res.json({ success: 'Nom modifié !' })
        })
        .error(err =>
            res.json({ error: err }))

})

//modifier étapes recette
recipe.put('/recipe/step/update', (req, res) => {
    Recipe.update({ etapes: req.sanitize(req.body.etapes) }, { where: { idRecette: req.body.idRecette } })
        .then(() => {
            res.json({ success: 'Etapes modifié !' })
        })
        .error(err =>
            res.json({ error: err }))

})

//modifier astuce recette
recipe.put('/recipe/astuce/update', (req, res) => {
    Recipe.update({ astuce: req.sanitize(req.body.astuce) }, { where: { idRecette: req.body.idRecette } })
        .then(() => {
            res.json({ success: 'Astuce modifié !' })
        })
        .error(err =>
            res.json({ error: err }))

})

//modifier temps recette
recipe.put('/recipe/temps/update', (req, res) => {
    console.log("temps")
    console.log(req)
    Recipe.update({ tempsPreparation: req.sanitize(req.body.tempsPreparation), tempsCuisson: req.sanitize(req.body.tempsCuisson) }, { where: { idRecette: req.body.idRecette } })
        .then(() => {
            console.log("cc")
            res.json({ success: 'Temps préparation et cuisson modifié !' })
        })
        .error(err =>
            res.json({ error: err }))

})

//modifier part recette
recipe.put('/recipe/part/update', (req, res) => {
    console.log("part")
    console.log(req)
    Recipe.update({ nbrePart: req.sanitize(req.body.nbrePart), libellePart: req.sanitize(req.body.libellePart) }, { where: { idRecette: req.body.idRecette } })
        .then(() => {
            res.json({ success: 'Nombre et libellé de part modifié !' })
        })
        .error(err =>
            res.json({ error: err }))

})

//supprimer un ingrédient d'une recette
recipe.delete('/recipe/:idRecette/ingredient/:idIngredient/delete', (req, res) => {
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

//supprimer une recette d'une catégorie
recipe.delete('/recipe/:idRecette/category/:idCategorie/delete', (req, res) => {
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
//ajouter un ingrédient à une recette
recipe.post(`/recipe/:idRecette/add/ingredient/:idIngredient`, (req, res) => {

    UtiliserIngredients.create(req.body)
        .then((res) => {
            res.json(res)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//ajouter une catégorie à une recette
recipe.post(`/recipe/:idRecette/category/add`, (req, res) => {
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





//selectionner que les catégories dont une recette ne fait pas partie

recipe.get('/recipe/:idRecette/category/rest', (req, res) => {
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


//Récupérer les ingrédients qui ne sont pas utilisés dans une recette
recipe.get('/recipe/:idRecette/ingredient/rest', (req, res) => {
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

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})
recipe.use(multerMid.single('file'))

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `FunOfHeuristic_${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

//upload image
recipe.post('/uploads', upload.single('file'), async (req, res, next) => {
    console.log(req.file)
    try {
        const myFile = req.file
        //myFile.originalname = myFile.filename
        const imageUrl = await uploadImage(myFile)
        db.sequelize.query("INSERT INTO `images`(`idImage`, `lienImage`) VALUES (NULL,?)", {
            replacements: [imageUrl],
            type: sequelize.QueryTypes.INSERT
        }).then(resultats => {
            console.log(resultats)
            res.json(resultats)
        }).catch(err => {
            res.json({ error: err })
        })
    } catch (error) {
        next(error)
    }
})

//Récupérer les ingrédients qui ne sont pas utilisés dans une recette
recipe.get('/image/:idRecette', (req, res) => {
    db.sequelize.query("SELECT images.* FROM images, illustrerRecettes, recettes WHERE recettes.idRecette = illustrerRecettes.idRecette AND illustrerRecettes.idImage = images.idImage AND recettes.idRecette=?", {
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

//Modifier image d'une recette
recipe.post('/image/update', (req, res) => {
    console.log(req)
    db.sequelize.query("UPDATE illustrerRecettes SET idImage = ? WHERE idRecette = ?", {
        replacements: [req.body.idImage, req.body.idRecette]
    })
        .then(result => {
            res.json(result)
        }).catch(err => {
            res.json({ error: err })
        })

})

recipe.post('/recipe/update/image', (req, res) => {
    console.log(req)
    db.sequelize.query("INSERT INTO `illustrerRecettes` (`idRecette`, `idImage`) VALUES (?, ?)", {
        replacements: [req.body.idRecette, req.body.idImage]
    })
        .then(result => {
            res.json(result)
        }).catch(err => {
            res.json({ error: err })
        })
})




//Commentaires

//ajout commentaire
recipe.post('/commentaires/add', (req, res) => {
    const commentaire = {
        message: req.body.message,
        dateCommentaire: new Date(),
        ecritPar: req.body.ecritPar,
        concerne: req.body.concerne,
        parent: req.body.parent
    }

    console.log(commentaire)
    Commentaire.create(commentaire)
        .then(res => {
            res.send("Commentaire créé !")
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//modifier commentaire
recipe.post('/commentaires/update', (req, res) => {
    console.log(req.body)
    Commentaire.update({
        message: req.sanitize(req.body.message)
    }, {
        where: {
            concerne: req.body.concerne,
            ecritPar: req.body.ecritPar
        }
    })
        .then(res => {
            res.send("Commentaire changé !")
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer tous les commentaires d'une recette
recipe.get('/recipe/:id/commentaires', (req, res) => {

    Commentaire.findAll({
        where: {
            concerne: req.params.id,
            parent: 0
        },
        order: [
            ["dateCommentaire", "DESC"]
        ]
    })
        .then(commentaire => {
            if (commentaire) {
                res.json(commentaire)
            } else {
                res.send("Il n'y a pas encore de commentaires pour cette recette")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer tous les commentaires fils d'un commentaire d'une recette
recipe.get('/recipe/:id/commentaires/reponse/:idCommentaire', (req, res) => {

    Commentaire.findAll({
        where: {
            concerne: req.params.id,
            parent: req.params.idCommentaire
        },
        order: [
            ["dateCommentaire", "ASC"]
        ]
    })
        .then(commentaire => {
            if (commentaire) {
                res.json(commentaire)
            } else {
                res.send("Il n'y a pas encore de commentaires pour cette recette")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//supprimer un commentaire
recipe.delete('/commentaire/:id/delete', (req, res) => {
    Commentaire.destroy({
        where: {
            idCommentaire: req.params.id

        }
    })
        .then(() => {

            res.send('Comment deleted!')
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Récupérer les commentaires d'un utilisateur
recipe.get('/:pseudo/mescommentaires', (req, res) => {

    Commentaire.findAll({
        where: {
            ecritPar: req.params.pseudo
        },
        order: [
            ["dateCommentaire", "DESC"]
        ]
    })
        .then(commentaire => {
            if (commentaire) {
                res.json(commentaire)
            } else {
                res.send("Vous n'avez pas encore écrit de commentaires")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//récupérer le menu du moment
recipe.get('/menu/recipe', (req, res) => {
    db.sequelize.query("SELECT idMenu, recettes.* FROM menus INNER JOIN recettes ON menus.idRecette = recettes.idRecette")
        .then(menu => {
            if(menu) {
                res.json(menu[0])
            } else {
                res.send("Pas de recettes disponibles dans le menu")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//récupérer le petit dejeuner du moment
recipe.get('/menu/petitDej', (req, res) => {
    db.sequelize.query("SELECT recettes.* FROM menus, recettes WHERE menus.idMenu = 1 AND menus.idRecette = recettes.idRecette")
        .then(menu => {
            if(menu) {
                res.json(menu[0])
            } else {
                res.send("Pas de petit déjeuner disponibles dans le menu")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//récupérer le petit dejeuner du moment
recipe.get('/menu/repas', (req, res) => {
    db.sequelize.query("SELECT recettes.* FROM menus, recettes WHERE menus.idMenu = 2 AND menus.idRecette = recettes.idRecette")
        .then(menu => {
            if(menu) {
                res.json(menu[0])
            } else {
                res.send("Pas de repas disponibles dans le menu")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//récupérer le petit dejeuner du moment
recipe.get('/menu/douceur', (req, res) => {
    db.sequelize.query("SELECT recettes.* FROM menus, recettes WHERE menus.idMenu = 3 AND menus.idRecette = recettes.idRecette")
        .then(menu => {
            if(menu) {
                res.json(menu[0])
            } else {
                res.send("Pas de douceur disponibles dans le menu")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})


module.exports = recipe