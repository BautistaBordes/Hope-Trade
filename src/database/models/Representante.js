const { DataTypes } = require('sequelize');
const sequelize = require('../index');

let alias = 'Representante';

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
    },
    apellido: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    mail: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    }
};

let config = {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: "updated_at",
    tableName: "representante"
}

const Representante = sequelize.define(alias, cols, config);

module.exports = Representante;