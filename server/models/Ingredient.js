const db = require("../database/db.js")
const Sequelize = require('sequelize')
const UtiliserIngredient = require("../models/UtiliserIngredients")

var Ingredient = db.sequelize.define(
    'ingredient',
    {
        idIngredient: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nomIngredient : {
            type: Sequelize.STRING
        }
    },
    
    {
        timestamps: false,
        freezeTableName: true
    }
)

Ingredient.associate = (models) => {
    belongsToMany(models.UtiliserIngredient, {foreignKey : 'idIngredient'})
}

module.exports = Ingredient