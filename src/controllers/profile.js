const Publicacion = require("../database/models/Publicacion");
const Usuario = require('../database/models/Usuario') 
const { Op } = require('sequelize');
const { validationResult } = require("express-validator")
const bcrypt = require('bcryptjs');

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
        res.render('profile/changePassword')
    },
    changePasswordProcess: async (req,res)=> {
        const result = validationResult(req);

        if(result.errors.length > 0){
            return res.render("profile/changePassword", {
                errors: result.mapped(),
                msgError: "Hubo un problema los datos para cambiar la contraseña",
                oldData: req.body
            });
        }
        
        const encryptedPassword = bcrypt.hashSync(req.body.new_psw, 10);
        try {
            const usuario = await Usuario.update({
                password: encryptedPassword
            },
            {
                where: {
                    id: req.session.usuario.id
                }
            }
            );
            res.redirect("/profile")
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = controlador;