require("dotenv").config();

//bd du site
const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
console.log(sequelize);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

/*
//local
const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize("marine'srecipes", "root", "root", {
  host: "localhost",
  port: 8889,
  dialect: "mysql",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;*/
