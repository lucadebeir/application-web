const Sequelize = require('sequelize')
const db = require("../database/db.js")

module.exports = db.sequelize.define(
    'recipeList', {
        idRecipeList: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nomRecette: {
            type: Sequelize.STRING
        },

        pseudoUser: {
            type: Sequelize.STRING,

        },
        idRecette: {
            type: Sequelize.INTEGER
        },
        complet: {
            type: Sequelize.BOOLEAN
        }
    }, {
        timestamps: false
    }
)