const Sequelize = require('sequelize')
const db = require("../database/db.js")
const UtiliserIngredient = require("../models/UtiliserIngredients")

var Unite = db.sequelize.define(
    'unite',
    {
        idUnite: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        libelleUnite : {
            type: Sequelize.STRING
        }
    },
    
    {
        timestamps: false
    }
)


Unite.associate = (models) => {
    belongToMany(models.UtiliserIngredient, {foreignKey : 'idUnite'})
}

module.exports = Unite
