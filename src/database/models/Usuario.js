const { DataTypes } = require('sequelize');
const sequelize = require('../index');


let alias = 'Usuario'; // esto debería estar en singular

let cols = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    dni: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    mail: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    }
};

let config = {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: "updated_at",
    tableName: "usuario"
}

const Usuario = sequelize.define(alias, cols, config);

module.exports = Usuario;