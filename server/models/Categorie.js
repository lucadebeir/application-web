const Sequelize = require('sequelize')
const db = require("../database/db.js")
const ClasserDans = require("../models/ClasserDans")

var Categorie = db.sequelize.define(
    'categorie',
    {
        idCategorie: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        libelleCategorie : {
            type: Sequelize.STRING
        }
    },
    
    {
        timestamps: false
    }
)

module.exports = Categorie
