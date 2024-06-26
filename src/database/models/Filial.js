const { DataTypes } = require('sequelize');
const sequelize = require('../index');


let alias = 'Filial'; // esto debería estar en singular

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
    direccion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    hora_apertura: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    hora_cierre: {
        type: DataTypes.TIME,
        allowNull: false,
    }
};

let config = {
    createdAt: 'created_at',
    updatedAt: false,
    tableName: "filial"
}

const Filial = sequelize.define(alias, cols, config);

module.exports = Filial;