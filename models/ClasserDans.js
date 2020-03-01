const Sequelize = require('sequelize')
const db = require("../database/db.js")
const Categorie = require("../models/Categorie")
const Recipe = require("../models/Recipe")

var ClasserDans = db.sequelize.define(
    'classerDans',
    {
        idRecette: {
            type: Sequelize.INTEGER,
        },
        idCategorie : {
            type: Sequelize.INTEGER
        }
    },
    
    {
        timestamps: false
    }
)


ClasserDans.associate = (models) => {
    belongToMany(models.Categorie, {foreignKey : 'idCategorie'})
}
ClasserDans.associate = (models) => {
    belongToMany(models.Recipe, {foreignKey : 'idRecipe'})
}

module.exports = ClasserDans
