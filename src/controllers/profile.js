const Publicacion = require("../database/models/Publicacion");
const Usuario = require('../database/models/Usuario') 
const { Op } = require('sequelize');

const controlador ={
    profile: (req, res) => {
        res.render('profile/index')
    },

    myPost: async (req, res) => {
        const publicaciones = await Publicacion.findAll( { include: Usuario, where: {
            usuario_id: {
                [Op.eq]: req.session.usuario.id
            }
        }});
        res.render("posts/index", {
            publicaciones: publicaciones, title: "Mis publicaciones"
        });
    },

    changePassword: (req,res) => {
        res.render('profile/index')
    }

}

module.exports = controlador;