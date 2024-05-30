const { DataTypes } = require('sequelize');
const sequelize = require('../index');


let alias = 'Intercambio'; // esto debería estar en singular

let cols = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

let config = {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: "intercambio"
}

const Intercambio = sequelize.define(alias, cols, config);

module.exports = Intercambio;