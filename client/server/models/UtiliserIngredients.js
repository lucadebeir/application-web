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
            type: Sequelize.INTEGER,
            primaryKey: true

        },
      
        idIngredient : {
            type: Sequelize.INTEGER,
            primaryKey: true

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


module.exports = UtiliserIngredients