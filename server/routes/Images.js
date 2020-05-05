const express = require("express")
const image = express.Router()
const cors = require("cors")
const db = require("../database/db.js")
const sequelize = require("sequelize")
image.use(cors())
const uploadImage = require('../helpers/helpers')
let multer = require('multer');
const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})
image.use(multerMid.single('file'))

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
image.post('/uploads', upload.single('file'), async (req, res, next) => {
    try {
        const myFile = req.file
        //myFile.originalname = myFile.filename
        const imageUrl = await uploadImage(myFile)
        db.sequelize.query("INSERT INTO `images`(`idImage`, `lienImage`) VALUES (NULL,?)", {
            replacements: [imageUrl],
            type: sequelize.QueryTypes.INSERT
        }).then(resultats => {
            res.json(resultats)
        }).catch(err => {
            res.json({ error: err })
        })
    } catch (error) {
        next(error)
    }
})

//Récupérer les ingrédients qui ne sont pas utilisés dans une recette
image.get('/:idRecette', (req, res) => {
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

//Récupérer les images d'un commentaire
image.get('/commentaire/:idCommentaire', (req, res) => {
    db.sequelize.query("SELECT images.* FROM images, illustrerCommentaires, commentaires WHERE commentaires.idCommentaire = illustrerCommentaires.idCommentaire AND illustrerCommentaires.idImage = images.idImage AND commentaires.idCommentaire=?", {
        replacements: [req.params.idCommentaire],
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
image.post('/update', (req, res) => {
    db.sequelize.query("UPDATE illustrerRecettes SET idImage = ? WHERE idRecette = ?", {
        replacements: [req.body.idImage, req.body.idRecette]
    })
        .then(result => {
            res.json(result)
        }).catch(err => {
            res.json({ error: err })
        })

})

//Ajouter une image à une recette
image.post('/recipe/update/image', (req, res) => {
    db.sequelize.query("INSERT INTO `illustrerRecettes` (`idRecette`, `idImage`) VALUES (?, ?)", {
        replacements: [req.body.idRecette, req.body.idImage]
    })
        .then(result => {
            res.json(result)
        }).catch(err => {
            res.json({ error: err })
        })
})

//Ajouter une image à un commentaire
image.post('/commentaires/addImage', (req, res) => {
    db.sequelize.query("INSERT INTO `illustrerCommentaires` (`idCommentaire`, `idImage`) VALUES (?, ?)", {
        replacements: [req.body.idCommentaire, req.body.idImage]
    })
        .then(result => {
            res.json(result)
        }).catch(err => {
            res.json({ error: err })
        })
})

module.exports = image