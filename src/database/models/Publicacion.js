const { DataTypes } = require('sequelize');
const sequelize = require('../index');


let alias = 'Publicacion'; // esto debería estar en singular

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
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
};

let config = {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: "updated_at",
    tableName: "publicacion"
}

const Publicacion = sequelize.define(alias, cols, config);

module.exports = Publicacion;