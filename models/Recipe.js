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
      
        datePublication : {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW

        },
        nbFavoris : {
            type: Sequelize.BOOLEAN,
            defaultValue : 0 
        },
        nbVues : {
            type: Sequelize.INTEGER,
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