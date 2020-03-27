const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const Recipe = require("../models/Recipe")
const passwordResetToken = require("../models/ResetToken")
const crypto = require('crypto');
users.use(cors())
//require ('dotenv').config()
//var xoauth2 = require('xoauth2');

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    '680726405067-3gam69kea82fcsu8al0ff3kuqcaengtl.apps.googleusercontent.com',
    'TGmXKDruFmLuwgVlyZtQ7S7O', // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
)
oauth2Client.setCredentials({
    refresh_token: '1//04BWvnOqpAFjgCgYIARAAGAQSNwF-L9IrXjtjL9QBYGwV5XEf1wECPN7rc_2jz17s8bBRPeJlxrv7YS4UxiJxHHyXbcVhYj0misA'
});
const accessToken = oauth2Client.getAccessToken()

process.env.SECRET_KEY = 'secret'

const nodemailer = require("nodemailer");

/*
	Here we are configuring our SMTP Server details.
	STMP is mail server which is responsible for sending and recieving email.
*/
const smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    direct : true,
    service: 'gmail',
    from: `"Marine's Recipes" <marinesrecipes@gmail.com>`,
    tls: {
        rejectUnauthorized: false
    },
    auth: {  
        type: 'OAuth2',
        user: 'marinesrecipes@gmail.com',  
        clientId: '680726405067-3gam69kea82fcsu8al0ff3kuqcaengtl.apps.googleusercontent.com',            
        clientSecret: 'TGmXKDruFmLuwgVlyZtQ7S7O',  
        refreshToken: '1//04BWvnOqpAFjgCgYIARAAGAQSNwF-L9IrXjtjL9QBYGwV5XEf1wECPN7rc_2jz17s8bBRPeJlxrv7YS4UxiJxHHyXbcVhYj0misA',
        accessToken: accessToken 
        
       /*user: process.env.USER_MAIL,
       pass: process.env.PASS_MAIL*/
    }  
});


var rand, mailOptions, host, link;


users.get('/newRecipe/:pseudo/:idRecette', function (req, res) {
    host = req.get('host');
    link = "http://http://marine-s-recipe.herokuapp.com/recipe/" + req.params.idRecette;
    User.findOne({
        where: {
            pseudo: req.sanitize(req.params.pseudo)
        }
    })
        .then(user => {
            Recipe.findOne({
                where: {
                    idRecette: req.sanitize(req.params.idRecette)
                }
            })
                .then(recette => {
                    if (user && recette) {
                        mailOptions = {
                            //from: 'marinesrecipes@gmail.com',
                            to: user.email,
                            subject: "Notification de Marine's recipes",
                            generateTextFromHTML: true,
                            html: "<div class='card text-center'>"
                                + "<div class='card-header'>"
                                + "<h1>Marine Téroitin a écrit un nouveau post</h1></div>"
                                + "<div class='card-body'>"
                                + "<hr>"
                                + "Bonjour " + user.pseudo + ", "
                                + "<br>"
                                + "Marine Téroitin a écrit un nouveau post sur Marine's recipes."
                                + "<br>"
                                + "<div class='card text-center>"
                                + "<div class='card-body'>"
                                + "<h3>" + recette.nomRecette + "</h3>"
                                + "<br>" + recette.etapes + "<br>"
                                + "<a href=" + link + " class='btn btn-primary'>Découvrir</a>"
                                + "</div>"
                        }
                        console.log(mailOptions);
                        smtpTransport.sendMail(mailOptions, (error, response) => {
                            error ? console.log(error) : console.log(response);
                            smtpTransport.close();
                       })
                    }
                })
        })
        .catch(err => {
            res.send('error: ' + err)
        })

});

//Confirmation du mail
users.get('/verify', function (req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            console.log("email is verified");
            User.update({ emailConfirmed: true }, { where: { pseudo: req.query.pseudo } })
            //res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
            res.redirect("http://" + req.get('host') + "/login")
        }
        else {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
    else {
        res.end("<h1>Request is from unknown source");
    }
});

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
            if (!user) {
                if (req.sanitize(req.body.mdp) === req.sanitize(req.body.mdp2)) {
                    const hash = bcrypt.hashSync(userData.mdp, 10)
                    userData.mdp = hash
                    User.create(userData) //equivalent de INSERT INTO en sql
                        .then(user => {
                            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                                expiresIn: 1440
                            })
                            rand = Math.floor((Math.random() * 100) + 54);
                            host = req.get('host');
                            console.log(host)
                            link = "http://" + req.get('host') + "/server/verify?id=" + rand + "&pseudo=" + req.body.pseudo;
                            mailOptions = {
                                to: req.body.email,
                                subject: "Please confirm your Email account",
                                text: "Hello,\n\nPlease Click on the link to verify your email."
                                +"\n\n" + link
                            }
                            console.log(mailOptions);
                            smtpTransport.sendMail(mailOptions, (error, response) => {
                                if (error) {
                                    console.log(error);
                                    res.end("error");
                                } else {
                                    console.log("Message sent: " + response.message);
                                    res.end("sent");
                                }
                            })
                            res.json({ token: token })
                        })
                        .catch(err => {
                            res.json({ error: err })
                        })
                } else {
                    res.json({ error: "Les mots de passe ne sont pas identiques." })
                }

            } else {
                res.json({ error: "L'utilisateur existe déjà" })
            }
        })
        .catch(err => {
            res.json({ error: err })
        })
})

//Connexion
users.post('/login', (req, res) => {
    User.findOne({
        where: {
            pseudo: req.sanitize(req.body.pseudo)
        }
    })
        .then(user => {
            if (!user) {
                res.json({ error: "Mot de passe et/ou pseudo incorrect" })
            } else {
                if (bcrypt.compareSync(req.sanitize(req.body.mdp), user.mdp)) {
                    let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.json({ token: token })
                } else {
                    res.json({ error: "Mot de passe et/ou pseudo incorrect" })
                }
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

//Tous les abonnés (get pour recuperer)
users.get('/abonneNews', (req, res) => {
    User.findAll({
        where: {
            abonneNews: true
        }
    })
        .then(user => {
            if (user) {
                res.json(user)
            } else {
                res.send("Aucun abonné !")
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
                res.json({ error: 'Champ(s) manquant(s)' })
            } else {
                if (bcrypt.compareSync(req.sanitize(req.body.mdp), user.mdp)) {
                    if (req.sanitize(req.body.newmdp) === req.sanitize(req.body.mdp2)) {
                        const hash = bcrypt.hashSync(userData.newmdp, 10)
                        User.update(
                            { mdp: hash },
                            { where: { pseudo: req.sanitize(req.params.pseudo) } }
                        )
                            .then(() => {
                                res.json({ success: 'Mot de passe modifié !' })
                            })
                            .error(err => handleError(err))
                    } else {
                        res.json({ error: "Les deux mots de passe ne sont pas identiques." }) /*json permet de renvoyer uniquement ce qu'il y a entre {}
                    alors que si on met send on recuperera toute la requete http*/
                    }

                } else {
                    res.json({ error: "Mot de passe incorrect!" })
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
        {
            email: req.sanitize(req.body.email),
            abonneNews: req.sanitize(req.body.abonneNews),
        },
        { where: { pseudo: req.sanitize(req.params.pseudo) } }
    )
        .then(() => {
            res.json({ success: 'Informations personnelles modifiées avec succès !' })
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

users.post('/req-reset-password', async (req, res) => {
    if (!req.body.email) {
        return res
            .status(500)
            .json({ message: 'Email requis' });
    }
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) {
        return res
            .status(409)
            .json({ message: "L'email n'existe pas " });
    }
    var resettoken = {
        userId: user.pseudo, 
        resettoken: crypto.randomBytes(16).toString('hex')
    }
    console.log(resettoken)
    passwordResetToken.create(resettoken)
        .then(() => {
            res.status(200).json({ message: 'Mot de passe modifié avec succès' });
            mailOptions = {
                to: user.email,
                subject: "Mot de passe oublié sur Marine's recipes",
                text: "Vous recevez cet email car vous (ou une autre personne) avez demandé à réinitialiser le mot de passe de votre compte sur Marine's recipes .\n\n" +
                    "Cliquer sur le lien suivant ou coller le dans la barre URL de votre navigateur:\n\n" +
                    'http://marine-s-recipe.herokuapp.com/response-reset-password/' + resettoken.resettoken + '\n\n' +
                    "Si vous n'avez pas demandé à changer votre mot de passe, ignorer cet email et votre mot de passe restera inchangé.\nBonne journée ! \n Marine."
            }
            console.log(mailOptions)
            smtpTransport.sendMail(mailOptions, (error, response) => {
                if (error) {
                    console.log(error);
                    res.end("error");
                } else {
                    console.log("Message sent: " + response.message);
                    res.end("sent");
                }
            })
    })
}
)

users.post('/valid-password-token', async function (req, res) {
    console.log(req.body)
    if (!req.body.resettoken) {
        return res
            .status(500)
            .json({ message: 'Token requis' });
    }
    const user = await passwordResetToken.findOne({
        resettoken: req.body.resettoken
    });
    if (!user) {
        return res
            .status(409)
            .json({ message: 'Invalide URL' });
    }
    User.findOne({
        where : { pseudo: user.userId }
    }).then(() => {
        res.status(200).json({ message: 'Token verifié.' });
        }).catch((err) => {
        return res.status(500).send({ msg: err.message });
    });
})

users.post('/new-password', async function (req, res) {
    passwordResetToken.findOne({
        where : 
            { resettoken: req.body.resettoken }
    }).then((userToken) => {
        console.log(userToken)
        if (!userToken) {
            return res
                .status(409)
                .json({ message: 'Le token a expiré' });
        }

        User.findOne({
            where : {
                pseudo: userToken.userId
            }
        }).then((userEmail) => {
            console.log(userEmail)
            if (!userEmail) {
                return res
                    .status(409)
                    .json({ message: "Cette adresse mail n'existe pas" });
            }
            const hash = bcrypt.hashSync(req.body.newPassword, 10)
            User.update(
                { mdp: hash },
                { where: { pseudo: userEmail.pseudo } }
            ).then(() =>  {
                passwordResetToken.destroy({ 
                    where : {
                        userId: userToken.userId, 
                        resettoken: userToken.resettoken 
                    }
                });
                return res
                    .status(201)
                    .json({ message: 'Mot de passe changé avec succès' });
            })
            .catch(err => {
                res.send('error: ' + err)
            })
        })

    })
})

users.get('/contact/send', (req, res) => {
    if (!req.query.email) {
        return res
            .status(500)
            .json({ message: 'Email requis' });
    }
    const user = User.findOne({
        where: {
            email: req.query.email
        }
    });
    if (!user) {
        return res
            .status(409)
            .json({ message: "L'email n'existe pas " });
    } else {
        mailOptions = {
            from: req.query.email,
            to: 'marinesrecipes@gmail.com',
            subject: req.query.subject,
            html: '<strong>From : </strong>' + req.query.email + '<br><br><strong>Message : </strong>' + req.query.message
        }
        smtpTransport.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log(error);
                res.end("error");
            } else {
                console.log("Message sent: " + response.success);
                res.end("sent");
            }
        })
    }
    
})

module.exports = users