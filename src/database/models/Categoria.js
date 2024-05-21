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
    //tengo que agregar esto sino cuando accedo despues de un publicacion.findall(include: Categoria) aparece Categorium???
    //xq usa una dependencia que te cambia los nombres automaticamente, capaz en ingles es util, aca no.
    //https://sequelize.org/docs/v6/other-topics/naming-strategies/#singular-vs-plural
    name: {
        singular: 'Categoria',
        plural: 'Categoria',
    },
    tableName: "categoria"
}

const Categoria = sequelize.define(alias, cols, config);

module.exports = Categoria;