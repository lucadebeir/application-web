const Sequelize = require('sequelize')
const db = require("../database/db.js")
const Commentaire = require("./Commentaire")
const Image = require("./Image")

var IllustrerCommentaire = db.sequelize.define(
    'illustrerCommentaire',
    {
        idCommentaire : {
            type: Sequelize.INTEGER,
            primaryKey: true

        },
        idImage: {
            type: Sequelize.INTEGER,
            primaryKey: true
        }
        
    },
    {
        timestamps: false
    }
)

IllustrerCommentaire.hasOne(Commentaire, {foreignKey: 'idCommentaire'})
IllustrerCommentaire.hasMany(Image, {foreignKey: 'idImage'})


module.exports = IllustrerCommentaire