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
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

//local
/*const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize(
  process.env.DB_NAME_LOCAL,
  process.env.DB_USER_LOCAL,
  process.env.DB_PASSWORD_LOCAL,
  {
    host: process.env.DB_HOST_LOCAL,
    port: process.env.DB_PORT_LOCAL,
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

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;*/
