const Publicacion = require("../database/models/Publicacion");
const Usuario = require('../database/models/Usuario') 
const Representante = require('../database/models/Representante') 
const Voluntario = require('../database/models/Voluntario') 
const { Op } = require('sequelize');
const { validationResult } = require("express-validator")
const bcrypt = require('bcryptjs');
const Categoria = require("../database/models/Categoria");

const controlador ={
    profile: (req, res) => {
        res.render('profile/index')
    },

    myPost: async (req, res) => {
        const publicaciones = await Publicacion.findAll( { include: [Usuario, Categoria], where: {
            usuario_id: {
                [Op.eq]: req.session.usuario.id
            }
        }});
        res.render("posts/index", {
            publicaciones: publicaciones, title: "Mis publicaciones"
        });
    },

    changePassword: (req,res) => {
        let isEmployee = req.session.usuario.rol == 'comun' ? false : true;            
        res.render('profile/changePassword', { isEmployee : isEmployee })
    },
    changePasswordProcess: async (req,res)=> {
        const result = validationResult(req);
        let rol = req.session.usuario.rol;

        if(result.errors.length > 0){
            return res.render("profile/changePassword", {
                errors: result.mapped(),
                msgError: "Hubo un problema los datos para cambiar la contraseña",
                oldData: req.body
            });
        }
        let redirect = "/controlPanel"
        let aux;
        if ( rol == 'comun'){
            aux = Usuario
            redirect = "/profile"
        }else if ( rol == 'representante'){
            aux = Representante
        }else{
            aux = Voluntario
        }

        const encryptedPassword = bcrypt.hashSync(req.body.new_psw, 10);
  
        try {
            const usuario = await aux.update({
                password: encryptedPassword
            },
            {
                where: {
                    id: req.session.usuario.id
                }
            }
            );
            //literalmente arriba tenes el objeto sesion del usuario (q viaja en todas las reqs cuanda inicias sesion)
            //viaja tambien la contraseña (hasheada) asi q queda la vieja, podria ser actualizar el objeto o directamente salir de la sesion
            // redirigis al login (cuestiones de seguridad (?)
            //res.redirect(redirect)
            req.session.destroy();
            res.redirect("/login");
        } catch (error) {
            console.log(error)
        }   
    }

}

module.exports = controlador;