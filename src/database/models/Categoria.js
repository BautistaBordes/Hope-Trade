const { DataTypes } = require('sequelize');
const sequelize = require('../index');


let alias = 'Categoria';

let cols = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
};

let config = {
    createdAt: 'created_at',
    updatedAt: false,
    tableName: "categoria"
}

const Categoria = sequelize.define(alias, cols, config);

module.exports = Categoria;