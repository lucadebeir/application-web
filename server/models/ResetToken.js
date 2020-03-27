const Sequelize = require('sequelize')
const db = require("../database/db.js")

module.exports = db.sequelize.define(
    'resetToken',
    {
        userId: { type: Sequelize.STRING, required: true, ref: 'User' },
        resettoken: { type: Sequelize.STRING, required: true },
        createdAt: { type: Sequelize.DATE, required: true, default: Sequelize.NOW, expires: 43200 },
    }
);