const Sequelize = require('sequelize')
const db = require("../database/db.js")
const Recette = require("./Recipe")
const Image = require("./Image")

var IllustrerRecette = db.sequelize.define(
    'illustrerRecette',
    {
        idRecette : {
            type: Sequelize.INTEGER,
            primaryKey: true

        },
        idImage: {
            type: Sequelize.INTEGER,
            primaryKey: true
        }
        
    },
    {
        timestamps: false
    }
)

IllustrerRecette.hasOne(Recette, {foreignKey: 'idRecette'})
IllustrerRecette.hasMany(Image, {foreignKey: 'idImage'})


module.exports = IllustrerRecette