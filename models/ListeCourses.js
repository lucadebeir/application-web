const Sequelize = require('sequelize')
const db = require("../database/db.js")
const Ingredient = require("../models/Ingredient")
const User = require("../models/User")

var ListeCourses = db.sequelize.define(
    'liste_de_course',
    {
        idIngredient : {
            type: Sequelize.INTEGER

        },
        pseudo: {
            type: Sequelize.STRING
        }
        
    },
    {
        timestamps: false
    }
)

ListeCourses.hasOne(Ingredient, {foreignKey: 'idIngredient'})
ListeCourses.hasOne(User, {foreignKey: 'pseudo'})


module.exports = ListeCourses