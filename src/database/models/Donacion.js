const { DataTypes } = require('sequelize');
const sequelize = require('../index');


let alias = 'Donacion'; // esto debería estar en singular

let cols = {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    apellido: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    dni: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    tipo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
};

let config = {
    createdAt: 'created_at',
    updatedAt: false,
    tableName: "donacion"
}

const Donacion = sequelize.define(alias, cols, config);

module.exports = Donacion;