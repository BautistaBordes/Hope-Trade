const { DataTypes } = require('sequelize');
const sequelize = require('../index');


let alias = 'Oferta'; // esto debería estar en singular

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
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    url_foto: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
};

let config = {
    createdAt: 'created_at',
    updatedAt: false,
    tableName: "filial"
}

const Oferta = sequelize.define(alias, cols, config);

module.exports = Oferta;