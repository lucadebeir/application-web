const Sequelize = require('sequelize')
const db = require("../database/db.js")
const User = require("../models/User")
const Recipe = require("../models/Recipe")

var Favoris = db.sequelize.define(
    'favori',
    {
        pseudo : {
            type: Sequelize.STRING,
            primaryKey: true

        },
        idRecette : {
            type: Sequelize.INTEGER,
            primaryKey: true

        }
    },
    {
        timestamps: false
    }
)

Favoris.hasOne(Recipe, {foreignKey: 'idRecette'})
Favoris.hasOne(User, {foreignKey: 'pseudo'})


module.exports = Favoris