const Sequelize = require('sequelize')
const db = require("../database/db.js")
const Recette = require("./Recipe")
const User = require("./User")

var Notification = db.sequelize.define(
    'notification', {
        idNotification: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true

        },
        type: {
            type: Sequelize.TEXT

        },
        dateNotification: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW

        },
        pseudo: {
            type: Sequelize.STRING,

        },
        idRecette: {
            type: Sequelize.INTEGER,
        }


    }, {
        timestamps: false
    }
)

Notification.hasOne(Recette, { foreignKey: { name: 'idRecette', allowNull: false } })
Notification.hasOne(User, { foreignKey: { name: 'pseudo', allowNull: false } })


module.exports = Notification