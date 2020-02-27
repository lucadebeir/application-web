const express = require("express")
const users = express.Router()
const cors = require("cors") 
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY = 'secret'

//Inscription (post pour ajouter)    
users.post('/register', (req, res) => { //req = info user

    const userData = {
        pseudo: req.sanitize(req.body.pseudo),
        email: req.sanitize(req.body.email),
        mdp: req.sanitize(req.body.mdp),
        mdp2: req.sanitize(req.body.mdp2), 
        admin: req.sanitize(req.body.admin),
        abonneNews: req.sanitize(req.body.abonneNews),

    }

    User.findOne({ //un peu comme ma requete SQL
        where: {
            pseudo: req.sanitize(req.body.pseudo)
        }
    })
        .then(user => {
            if(!user) {
                if(req.sanitize(req.body.mdp )=== req.sanitize(req.body.mdp2)){
                    const hash = bcrypt.hashSync(userData.mdp, 10)
                    userData.mdp = hash
                    User.create(userData) //equivalent de INSERT INTO en sql
                    .then(user => {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        })
                        res.json({ token: token})
                    })
                    .catch(err => {
                        res.json({error: err})
                    })
                }else{
                    res.json({error: "Les mots de passe ne sont pas identiques."})
                }
                
            } else {
                res.json({ error: "L'utilisateur existe déjà" })
            }
        })
        .catch(err => {
            res.json({error:  err})
        })
})

//Connexion
users.post('/login', (req, res) => {
    console.log(req.body.pseudo)
    console.log(req.sanitize(req.body.pseudo))
    User.findOne({
        where: {
            pseudo: req.sanitize(req.body.pseudo)
        }
    })
        .then(user => {
            console.log(req.sanitize(req.body.mdp))
            console.log(user.mdp)
            if(bcrypt.compareSync(req.sanitize(req.body.mdp), user.mdp)) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.json({ token: token})
            } else {
                res.send("L'utilisateur n'existe pas")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Profile (get pour recuperer)
users.get('/profile', (req, res) => {
    var decoded = jwt.verify(req.sanitize(req.headers['authorization']), process.env.SECRET_KEY)

    User.findOne({
        where: {
            pseudo: decoded.pseudo
        }
    })
        .then(user => {
            if (user) {
                res.json(user)
            } else {
                res.send("L'utilisateur n'existe pas")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//changement mdp (put pour modifier)
users.put('/update-password/:pseudo', (req, res) => { 


    
    const userData = {
        pseudo: req.sanitize(req.params.pseudo),
        mdp: req.sanitize(req.body.mdp),
        newmdp: req.sanitize(req.body.newmdp),
        mdp2: req.sanitize(req.body.mdp2),
    }

    User.findOne({
        where: {
            pseudo: req.sanitize(req.params.pseudo)
        }
    })
    .then(user => {
        if (!req.sanitize(req.body.newmdp) || !req.sanitize(req.body.mdp) || !req.sanitize(req.body.mdp2)) {
            res.status(400)
            res.json({error:'Champ(s) manquant(s)'})
        } else {
            if(bcrypt.compareSync(req.sanitize(req.body.mdp), user.mdp)) {
                if(req.sanitize(req.body.newmdp) === req.sanitize(req.body.mdp2)){
                    const hash = bcrypt.hashSync(userData.newmdp, 10)
                    User.update(
                        { mdp: hash },
                        { where: { pseudo: req.sanitize(req.params.pseudo) } }
                    )
                    .then(() => {
                        res.json({success : 'Mot de passe modifié !'})
                    })
                    .error(err => handleError(err))
                }else{
                    res.json({error: "Les deux mots de passe ne sont pas identiques."}) /*json permet de renvoyer uniquement ce qu'il y a entre {}
                    alors que si on met send on recuperera toute la requete http*/
                }
            
            } else {
                res.json({error: "Mot de passe incorrect!"})
            }
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
}) 


//modifier info profile 
users.put('/mon-profile/:pseudo', (req, res) => { 
  

    const userData = {
        pseudo: req.sanitize(req.params.pseudo),
        email: req.sanitize(req.body.email),
        abonneNews: req.sanitize(req.body.abonneNews),
    }

    User.findOne({
        where: {
            pseudo: req.sanitize(req.params.pseudo)
        }
    })
  
        User.update(
            { email: req.sanitize(req.body.email), 
            abonneNews: req.sanitize(req.body.abonneNews),
            },
            { where: { pseudo: req.sanitize(req.params.pseudo) } }
            )
            .then(() => {
                res.json({success : 'Informations personnelles modifiées avec succès !'})
            })
            .error(err => handleError(err))
})


    
//supprimer compte
users.delete('/delete-profile/:pseudo', (req, res) => {
    User.destroy({
      where: {
        pseudo: req.sanitize(req.params.pseudo)
      }
    })
      .then(() => {
        res.send('User deleted!')
      })
      .catch(err => {
        res.send('error: ' + err)
      })
})
module.exports = users