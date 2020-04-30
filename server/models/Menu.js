const Sequelize = require('sequelize')
const db = require("../database/db.js")

var Menu = db.sequelize.define(
    'menu',
    {
        idMenu : {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        libellePart : {
            type: Sequelize.STRING
        },
        idRecette: {
            type: Sequelize.INTEGER
        }
    }
    , {
        timestamps: false
    }
)


Menu.associate = (models) => {
    belongToMany(models.Recipe, {foreignKey : 'idRecette'})
}

module.exports = Menu
