const express = require("express")
const commentaire = express.Router()
const cors = require("cors")
const Commentaire = require("../models/Commentaire")
commentaire.use(cors())

//ajout commentaire
commentaire.post('/add', (req, res) => {
    console.log(req.body)
    const commentaire = {
        message: req.body.message,
        dateCommentaire: new Date(),
        ecritPar: req.body.ecritPar,
        concerne: req.body.concerne,
        parent: req.body.parent
    }

    console.log(commentaire)
    Commentaire.create(commentaire)
        .then(resultats => {
            res.json(resultats)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//modifier commentaire
commentaire.post('/update', (req, res) => {
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
commentaire.get('/recipe/:id', (req, res) => {

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
commentaire.get('/recipe/:id/reponse/:idCommentaire', (req, res) => {

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
commentaire.delete('/commentaire/:id/delete', (req, res) => {
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
commentaire.get('/:pseudo/mescommentaires', (req, res) => {

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

module.exports = commentaire