const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const passwordResetToken = require("../models/ResetToken");
const crypto = require("crypto");
const db = require("../database/db.js");
const sequelize = require("sequelize");
users.use(cors());
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.AUTH_CLIENT,
  process.env.AUTH_CLIENT_PASSWORD, // Client Secret
  process.env.AUTH_URL // Redirect URL
);
oauth2Client.setCredentials({
  refresh_token: "Your Refresh Token Here",
});
const accessToken = oauth2Client.getAccessToken();
process.env.SECRET_KEY = "secret";
const nodemailer = require("nodemailer");

/*
	Here we are configuring our SMTP Server details.
	STMP is mail server which is responsible for sending and recieving email.
*/
const smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "gmail",
  from: `"Marine's Recipes" <marinesrecipes@gmail.com>`,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    type: "OAuth2",
    user: process.env.AUTH_USER,
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_PASSWORD,
    refreshToken: process.env.AUTH_REFRESH_TOKEN,
    accessToken: accessToken,

    /*user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL*/
  },
});

var rand, mailOptions, host, link;

//envoi mail aux abonnes quand nouvelle recette
users.get("/newRecipe/:pseudo/:idRecette", function (req, res) {
  host = req.get("host");
  link = "http://marinesrecipes.fr/recipe/" + req.params.idRecette;
  User.findOne({
    where: {
      pseudo: req.sanitize(req.params.pseudo),
    },
  })
    .then((user) => {
      Recipe.findOne({
        where: {
          idRecette: req.sanitize(req.params.idRecette),
        },
      }).then((recette) => {
        if (user && recette) {
          db.sequelize
            .query(
              "SELECT images.* FROM images, illustrerRecettes, recettes WHERE recettes.idRecette = illustrerRecettes.idRecette AND illustrerRecettes.idImage = images.idImage AND recettes.idRecette=?",
              {
                replacements: [req.params.idRecette],
                type: sequelize.QueryTypes.SELECT,
              }
            )
            .then((resultats) => {
              console.log(resultats);
              mailOptions = {
                //from: 'marinesrecipes@gmail.com',
                to: user.email,
                subject: "Nouvelle recette sur Marine's recipes",
                generateTextFromHTML: true,
                html:
                  "<div class='card text-center'>" +
                  "Bonjour " +
                  user.pseudo +
                  ", " +
                  "<br>" +
                  "<br>" +
                  "Une nouvelle recette est disponible sur Marine's recipes : " +
                  "<br>" +
                  "<h3>" +
                  decodeURI(decodeURIComponent(recette.nomRecette)) +
                  "</h3>" +
                  "<br>" +
                  "<br>" +
                  "<img src='cid:uniq-mailtrap.png'/>" +
                  "<br>" +
                  "<br>" +
                  decodeURI(decodeURIComponent(recette.mot)) +
                  "<br>" +
                  "<br>" +
                  "<a href=" +
                  link +
                  " class='btn btn-primary'>Découvrir la recette </a>" +
                  "<br>" +
                  "<br>" +
                  "Bonne journée," +
                  "<br>" +
                  "<br>" +
                  "Marine." +
                  "</div>",
                attachments: [
                  {
                    filename: resultats.nameImage,
                    path: resultats.lienImage,
                    cid: "uniq-mailtrap.png",
                  },
                ],
              };
              smtpTransport.sendMail(mailOptions, (error, response) => {
                error ? console.log(error) : console.log(response);
                smtpTransport.close();
              });
            });
        }
      });
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Confirmation du mail
users.get("/verify", function (req, res) {
  if (req.protocol + "://" + req.get("host") == "http://" + host) {
    if (req.query.id == rand) {
      User.update(
        { emailConfirmed: true },
        { where: { pseudo: req.query.pseudo } }
      );
      //res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
      res.redirect("http://marinesrecipes.fr/login");
      //res.redirect(
      //"android-app://com.lucadebeir.recipeApp/http/marinesrecipes.fr/login"
      //);
    } else {
      res.end("<h1>Bad Request</h1>");
    }
  } else {
    res.end("<h1>Request is from unknown source");
  }
});

users.post("/register/social", (req, res) => {
  const userData = {
    pseudo: req.sanitize(req.body.pseudo),
    email: req.sanitize(req.body.email),
    admin: req.sanitize(req.body.admin),
    abonneNews: req.sanitize(req.body.abonneNews),
    emailConfirmed: req.sanitize(req.body.emailConfirmed),
  };

  User.findOne({
    //un peu comme ma requete SQL
    where: {
      pseudo: req.sanitize(req.body.pseudo),
    },
  }).then((user) => {
    if (!user) {
      User.create(userData) //equivalent de INSERT INTO en sql
        .then((user) => {
          console.log(user);
          res.json({ user: user });
        });
    } else {
      res.json({ error: "L'utilisateur existe déjà" });
    }
  });
});

//Inscription (post pour ajouter)
users.post("/register", (req, res) => {
  //req = info user

  const userData = {
    pseudo: req.sanitize(req.body.pseudo),
    email: req.sanitize(req.body.email),
    mdp: req.sanitize(req.body.mdp),
    mdp2: req.sanitize(req.body.mdp2),
    admin: req.sanitize(req.body.admin),
    abonneNews: req.sanitize(req.body.abonneNews),
  };

  User.findOne({
    //un peu comme ma requete SQL
    where: {
      pseudo: req.sanitize(req.body.pseudo),
    },
  })
    .then((user) => {
      if (!user) {
        if (req.sanitize(req.body.mdp) === req.sanitize(req.body.mdp2)) {
          const hash = bcrypt.hashSync(userData.mdp, 10);
          userData.mdp = hash;
          User.create(userData) //equivalent de INSERT INTO en sql
            .then((user) => {
              let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
              });
              rand = Math.floor(Math.random() * 100 + 54);
              host = req.get("host");
              link =
                "http://" +
                req.get("host") +
                "/server/verify?id=" +
                rand +
                "&pseudo=" +
                req.body.pseudo;
              mailOptions = {
                to: req.body.email,
                subject: "Confirmation de votre compte sur Marine's Recipes",
                text:
                  "Bonjour " +
                  user.pseudo +
                  ", " +
                  "\n\n" +
                  "Vous vous êtes récemment inscrit sur Marine's Recipe, cliquez sur le lien suivant pour vérifier votre adresse mail : " +
                  "\n\n" +
                  link +
                  "\n\n" +
                  "Bonne journée," +
                  "\n\n" +
                  "Marine.",
              };
              smtpTransport.sendMail(mailOptions, (error, response) => {
                if (error) {
                  console.log(error);
                  res.end("error");
                } else {
                  console.log("Message sent: " + response.message);
                  res.end("sent");
                }
              });
              res.json({ token: token });
            })
            .catch((err) => {
              res.json({ error: err });
            });
        } else {
          res.json({ error: "Les mots de passe ne sont pas identiques." });
        }
      } else {
        res.json({ error: "L'utilisateur existe déjà" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

//Connexion
users.post("/login", (req, res) => {
  User.findOne({
    where: {
      pseudo: req.sanitize(req.body.pseudo),
    },
  })
    .then((user) => {
      if (!user) {
        res.json({ error: "Mot de passe et/ou pseudo incorrect" });
      } else if (!user.emailConfirmed) {
        res.json({
          error:
            "Vous devez vérifier votre adresse mail avant de pouvoir vous connecter ! :)",
        });
      } else {
        if (bcrypt.compareSync(req.sanitize(req.body.mdp), user.mdp)) {
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
          });
          res.json({ token: token });
        } else {
          res.json({ error: "Mot de passe et/ou pseudo incorrect" });
        }
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Pseudo existe
users.get("/login/:pseudo", (req, res) => {
  User.findOne({
    where: {
      pseudo: req.sanitize(req.params.pseudo),
    },
  }).then((user) => {
    console.log(user);
    if (user) {
      res.json({ success: "Pseudo existe déjà !" });
    } else {
      res.json({ success: "Nouveau inscrit !" });
    }
  });
});

//Profile (get pour recuperer)
users.get("/profile", (req, res) => {
  var decoded = jwt.verify(
    req.sanitize(req.headers["authorization"]),
    process.env.SECRET_KEY
  );

  User.findOne({
    where: {
      pseudo: decoded.pseudo,
    },
  })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.send("L'utilisateur n'existe pas");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//Tous les abonnés (get pour recuperer)
users.get("/abonneNews", (req, res) => {
  User.findAll({
    where: {
      abonneNews: true,
    },
  })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.send("Aucun abonné !");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//changement mdp (put pour modifier)
users.put("/update-password/:pseudo", (req, res) => {
  const userData = {
    pseudo: req.sanitize(req.params.pseudo),
    mdp: req.sanitize(req.body.mdp),
    newmdp: req.sanitize(req.body.newmdp),
    mdp2: req.sanitize(req.body.mdp2),
  };

  User.findOne({
    where: {
      pseudo: req.sanitize(req.params.pseudo),
    },
  })
    .then((user) => {
      if (
        !req.sanitize(req.body.newmdp) ||
        !req.sanitize(req.body.mdp) ||
        !req.sanitize(req.body.mdp2)
      ) {
        res.status(400);
        res.json({ error: "Champ(s) manquant(s)" });
      } else {
        if (bcrypt.compareSync(req.sanitize(req.body.mdp), user.mdp)) {
          if (req.sanitize(req.body.newmdp) === req.sanitize(req.body.mdp2)) {
            const hash = bcrypt.hashSync(userData.newmdp, 10);
            User.update(
              { mdp: hash },
              { where: { pseudo: req.sanitize(req.params.pseudo) } }
            )
              .then(() => {
                res.json({ success: "Mot de passe modifié !" });
              })
              .error((err) => handleError(err));
          } else {
            res.json({
              error: "Les deux mots de passe ne sont pas identiques.",
            });
            /*json permet de renvoyer uniquement ce qu'il y a entre {}
                                               alors que si on met send on recuperera toute la requete http*/
          }
        } else {
          res.json({ error: "Mot de passe incorrect!" });
        }
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//modifier info profile
users.put("/mon-profile/:pseudo", (req, res) => {
  User.findOne({
    where: {
      pseudo: req.sanitize(req.params.pseudo),
    },
  });

  User.update(
    {
      email: req.sanitize(req.body.email),
      abonneNews: req.sanitize(req.body.abonneNews),
    },
    { where: { pseudo: req.sanitize(req.params.pseudo) } }
  )
    .then(() => {
      res.json({
        success: "Informations personnelles modifiées avec succès !",
      });
    })
    .error((err) => handleError(err));
});

//supprimer compte
users.delete("/delete-profile/:pseudo", (req, res) => {
  User.destroy({
    where: {
      pseudo: req.sanitize(req.params.pseudo),
    },
  })
    .then(() => {
      res.send("User deleted!");
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//envoie mail pour changement de mdp
users.post("/req-reset-password", async (req, res) => {
  if (!req.body.email) {
    return res.status(500).json({ message: "Email requis" });
  }
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return res.status(409).json({ message: "L'email n'existe pas " });
  }
  var resettoken = {
    userId: user.pseudo,
    resettoken: crypto.randomBytes(16).toString("hex"),
  };
  passwordResetToken.create(resettoken).then(() => {
    //res.status(200).json({ message: 'Mot de passe modifié avec succès' });
    mailOptions = {
      to: user.email,
      subject: "Mot de passe oublié sur Marine's recipes",
      text:
        "Bonjour " +
        user.pseudo +
        ",  \n\nVous recevez cet email car vous (ou une autre personne) avez demandé à réinitialiser le mot de passe de votre compte sur Marine's recipes .\n\n" +
        "Cliquer sur le lien suivant ou coller le dans la barre URL de votre navigateur:\n\n" +
        "http://marinesrecipes.fr/response-reset-password/" +
        resettoken.resettoken +
        "\n\n" +
        "Si vous n'avez pas demandé à changer votre mot de passe, ignorer cet email et votre mot de passe restera inchangé.\n\nBonne journée ! \n\n Marine.",
    };
    smtpTransport.sendMail(mailOptions, (error, response) => {
      error ? console.log(error) : console.log(response);
      smtpTransport.close();
    });
  });
});

//vérification du token pour changement de mdp
users.post("/valid-password-token", async function (req, res) {
  if (!req.body.resettoken) {
    return res.status(500).json({ message: "Token requis" });
  }
  const user = await passwordResetToken.findOne({
    resettoken: req.body.resettoken,
  });
  if (!user) {
    return res.status(409).json({ message: "Invalide URL" });
  }
  User.findOne({
    where: { pseudo: user.userId },
  })
    .then(() => {
      res.status(200).json({ message: "Token verifié." });
    })
    .catch((err) => {
      return res.status(500).send({ msg: err.message });
    });
});

//changement de mdp après envoie du mail
users.post("/new-password", async function (req, res) {
  passwordResetToken
    .findOne({
      where: { resettoken: req.body.resettoken },
    })
    .then((userToken) => {
      if (!userToken) {
        return res.status(409).json({ message: "Le token a expiré" });
      }

      User.findOne({
        where: {
          pseudo: userToken.userId,
        },
      }).then((userEmail) => {
        if (!userEmail) {
          return res
            .status(409)
            .json({ message: "Cette adresse mail n'existe pas" });
        }
        const hash = bcrypt.hashSync(req.body.newPassword, 10);
        User.update({ mdp: hash }, { where: { pseudo: userEmail.pseudo } })
          .then(() => {
            passwordResetToken.destroy({
              where: {
                userId: userToken.userId,
                resettoken: userToken.resettoken,
              },
            });
            return res
              .status(201)
              .json({ message: "Mot de passe changé avec succès" });
          })
          .catch((err) => {
            res.send("error: " + err);
          });
      });
    });
});

//envoie du message page contact
users.get("/contact/send", (req, res) => {
  if (!req.query.email) {
    return res.status(500).json({ message: "Email requis" });
  }
  const user = User.findOne({
    where: {
      email: req.query.email,
    },
  });
  if (!user) {
    return res.status(409).json({ message: "L'email n'existe pas " });
  } else {
    mailOptions = {
      from: req.query.email,
      to: "marinesrecipes@gmail.com",
      subject: req.query.subject,
      generateTextFromHTML: true,
      html:
        "<strong>From : </strong>" +
        req.query.email +
        "<br><br><strong>Message : </strong>" +
        req.query.message,
    };
    smtpTransport.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log(error);
        res.end("error");
      } else {
        console.log("Message sent: " + response.success);
        res.end("sent");
      }
    });
  }
});

//renvoie user avec son pseudo
users.get("/user/:pseudo", (req, res) => {
  User.findOne({
    where: {
      pseudo: req.sanitize(req.params.pseudo),
    },
  })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.send("Aucun user avec ce pseudo !");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//renvoie tous les pseudos existants
users.get("/users/pseudo", (req, res) => {
  db.sequelize
    .query("SELECT users.pseudo FROM users", {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultats) => {
      res.json(resultats);
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

//renvoie tous les emails existants
users.get("/users/email", (req, res) => {
  db.sequelize
    .query("SELECT users.email FROM users", {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultats) => {
      res.json(resultats);
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

module.exports = users;
