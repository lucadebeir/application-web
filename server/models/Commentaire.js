const Sequelize = require('sequelize')
const db = require("../database/db.js")
const Recette = require("./Recipe")
const User = require("./User")

var Commentaire = db.sequelize.define(
    'commentaire', {
        idCommentaire: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true

        },
        message: {
            type: Sequelize.TEXT

        },
        dateCommentaire: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW

        },
        ecritPar: {
            type: Sequelize.STRING,

        },
        concerne: {
            type: Sequelize.INTEGER,
        }


    }, {
        timestamps: false
    }
)

Commentaire.hasOne(Recette, { foreignKey: 'idRecette' })
Commentaire.hasOne(User, { foreignKey: 'pseudo' })


module.exports = Commentaire