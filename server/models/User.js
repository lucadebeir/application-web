//sequelize remplace les requêtes sql
const Sequelize = require('sequelize')
const db = require("../database/db.js")

module.exports = db.sequelize.define(
    'user',
    {
        pseudo: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        email : {
            type: Sequelize.STRING
        },
        emailConfirmed : {
            type: Sequelize.BOOLEAN,
            defaultValue : Sequelize.FALSE
        },
        mdp : {
            type: Sequelize.STRING
        },
        admin : {
            type: Sequelize.BOOLEAN,
            defaultValue : Sequelize.FALSE
        },
        abonneNews : {
            type: Sequelize.BOOLEAN
        }
    },
    {
        timestamps: false
    }
)