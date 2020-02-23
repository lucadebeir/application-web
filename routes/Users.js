const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY = 'secret'

//Inscription
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

//Profile
users.get('/profile', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    users.findOne({
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


module.exports = users