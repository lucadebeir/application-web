const Sequelize = require('sequelize')
const db = require("../database/db.js")

var Image = db.sequelize.define(
    'image',
    {
        idImage : {
            type: Sequelize.INTEGER,
            primaryKey: true

        },
        lienImage: {
            type: Sequelize.STRING,
        }
        
    },
    {
        timestamps: false
    }
)

Image.associate = (models) => {
    belongsToMany(models.IllustrerUtilisateur, {foreignKey : 'idImage'})
}

module.exports = Image