const { DataTypes } = require('sequelize');
const sequelize = require('../index');


let alias = 'Comentario';

let cols = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
};

let config = {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    name: {
        singular: 'Comentario',
        plural: 'Comentario',
    },
    tableName: "comentario"
}

const Comentario = sequelize.define(alias, cols, config);

module.exports = Comentario;