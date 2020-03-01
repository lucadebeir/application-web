const Sequelize = require('sequelize')
const db = require("../database/db.js")
const Ingredient = require("../models/Ingredient")
const Unite = require("../models/Unite")

var UtiliserIngredients = db.sequelize.define(
    'utiliserIngredients',
    {
        qte: {
            type: Sequelize.FLOAT,
          
        },
        idRecette : {
            type: Sequelize.INTEGER

        },
      
        idIngredient : {
            type: Sequelize.INTEGER

        },
        idUnite : {
            type: Sequelize.INTEGER
        }
        
    },
    {
        timestamps: false
    }
)

UtiliserIngredients.hasOne(Ingredient, {foreignKey: 'idIngredient'})
UtiliserIngredients.hasOne(Unite, {foreignKey: 'idUnite'})
//UtiliserIngredients.belongsTo()

module.exports = UtiliserIngredients