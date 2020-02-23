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