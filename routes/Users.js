const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY = 'secret'

//Inscription (post pour ajouter)    
users.post('/register', (req, res) => {
    const userData = {
        pseudo: req.body.pseudo,
        email: req.body.email,
        mdp: req.body.mdp,
        mdp2: req.body.mdp2, 
        admin: req.body.admin,
        abonneNews: req.body.abonneNews,

    }

    User.findOne({
        where: {
            pseudo: req.body.pseudo
        }
    })
        .then(user => {
            if(!user) {
                if(req.body.mdp === req.body.mdp2){
                    const hash = bcrypt.hashSync(userData.mdp, 10)
                    userData.mdp = hash
                    User.create(userData)
                    .then(user => {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        })
                        res.json({ token: token})
                    })
                    .catch(err => {
                        res.send('error: ' + err)
                    })
                }else{
                    res.json("Les mots de passe ne sont pas identiques.")
                }
                
            } else {
                res.json({ error: "L'utilisateur existe déjà" })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//Connexion
users.post('/login', (req, res) => {
    User.findOne({
        where: {
            pseudo: req.body.pseudo
        }
    })
        .then(user => {
            if(bcrypt.compareSync(req.body.mdp, user.mdp)) {
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
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

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

//changement mdp (put pour modifier) MARCHE PAS !!!!!!!!!!!!!!!!!!!!
users.put('/update-password/:pseudo', (req, res) => { 

    //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    
    const userData = {
        pseudo: req.params.pseudo,
        mdp: req.body.mdp,
        newmdp: req.body.newmdp,
        mdp2: req.body.mdp2, 
    }

    User.findOne({
        where: {
            pseudo: req.params.pseudo
        }
    })
    .then(user => {
        if (!req.body.newmdp || !req.body.mdp || !req.body.mdp2) {
            res.status(400)
            res.send('Champ(s) manquant(s)')
        } else {
            if(bcrypt.compareSync(req.body.mdp, user.mdp)) {
                if(req.body.newmdp === req.body.mdp2){
                    const hash = bcrypt.hashSync(userData.newmdp, 10)
                    User.update(
                        { mdp: hash },
                        { where: { pseudo: req.params.pseudo } }
                    )
                    .then(() => {
                        res.send('Profil Updated!')
                    })
                    .error(err => handleError(err))
                }else{
                    res.send("Les deux mots de passe ne sont pas identiques.")
                }
            
            } else {
                res.send("Mot de passe incorrect!")
            }
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

users.delete('/delete-profile/:pseudo', (req, res) => {
    User.destroy({
      where: {
        pseudo: req.params.pseudo
      }
    })
      .then(() => {
        res.send('User deleted!')
      })
      .catch(err => {
        res.send('error: ' + err)
      })
})

//modifier info profile MARCJHE PAS!!!!!!!!!!!!!!!!!!!!!!!!!!
users.put('/mon-profile', (req, res) => { 
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    const userData = {
        email: req.body.email,
        abonneNews: req.body.abonneNews,
    }
    User.findOne({
        where: {
            pseudo: req.body.pseudo
        }
    })
    User.update(userData)
    .then(user => {
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
               expiresIn: 1440
           })
          res.json({ token: token})
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

// Update Task
users.put('/update-password2/:pseudo', (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    if (!req.query.newmdp || !req.query.mdp || !req.query.mdp2) {
      res.status(400)
      res.json({
        error: 'Bad Data'
      })
    } else {
      User.update(
        { mdp: req.query.newmdp },
        { where: { pseudo: req.params.pseudo } }
      )
        .then(() => {
          res.send('Profil Updated!')
        })
        .error(err => handleError(err))
    }
  })

module.exports = users