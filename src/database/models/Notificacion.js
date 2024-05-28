const { DataTypes } = require('sequelize');
const sequelize = require('../index');

let alias = 'Notificacion'; // esto debería estar en singular

let cols = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    contenido: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'pendiente'
    }
};

let config = {
    createdAt: 'created_at',
    updatedAt: false,
    tableName: "notificacion"
}

const Notificacion = sequelize.define(alias, cols, config);

module.exports = Notificacion;