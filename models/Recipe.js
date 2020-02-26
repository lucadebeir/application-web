const Sequelize = require('sequelize')
const db = require("../database/db.js")

module.exports = db.sequelize.define(
    'recipe',
    {
        idRecette: {
            type: Sequelize.INT,
            primaryKey: true,
            autoIncrement: true
        },
        nomRecette : {
            type: Sequelize.STRING
        },
        //finir à partir d'ici
        datePublication : {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW

        },
        nbFavoris : {
            type: Sequelize.BOOLEAN,
            defaultValue : 0 
        },
        nbVues : {
            type: Sequelize.INT,
            defaultValue : 0 
        },
        etapes : {
            type: Sequelize.TEXT
           
        }
    },
    {
        timestamps: false
    }
)