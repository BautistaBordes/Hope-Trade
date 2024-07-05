const { DataTypes } = require('sequelize');
const sequelize = require('../index');


let alias = 'Tarjeta'; // esto debería estar en singular

let cols = {
    numero: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },

    nombre: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    cdo_seguridad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    vencimiento: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    credito: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

let config = {
    timestamps: false,
    tableName: "tarjeta"
}

const Tarjeta = sequelize.define(alias, cols, config);

module.exports = Tarjeta;