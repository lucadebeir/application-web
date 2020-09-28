/*const Sequelize = require("sequelize")
const db = {}
const sequelize = new Sequelize("marinesrecipes_bd", "201428", "Luka-12021996", {
    host: "mysql-marinesrecipes.alwaysdata.net",
    dialect: "mysql",
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db*/

//local
const Sequelize = require("sequelize")
const db = {}
const sequelize = new Sequelize("marine'srecipes", "root", "root", {
    host: "localhost",
    port: 8889,
    dialect: "mysql",
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db