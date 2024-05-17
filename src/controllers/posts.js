const { validationResult } = require("express-validator");
const { Op } = require('sequelize');
const Publicacion = require("../database/models/Publicacion");
const Usuario = require("../database/models/Usuario");




const controlador = {
    index: async (req, res) => {
        const publicaciones = await Publicacion.findAll({ include: Usuario, where: {
            usuario_id: {
                [Op.ne]: req.session.usuario.id
            }
        }});
        res.render("posts/index", {
            publicaciones: publicaciones, title: "Publicaciones"
        });
    },
    myPosts: async (req, res) => {
        const publicaciones = await Publicacion.findAll( { include: Usuario, where: {
            usuario_id: {
                [Op.eq]: req.session.usuario.id
            }
        }});
        res.render("posts/index", {
            publicaciones: publicaciones, title: "Mis publicaciones"
        });
    },
    add: (req, res) => {
        res.render("posts/add");
    },
    addProccess: async (req, res) => {
        const result = validationResult(req);
        const {nombre, descripcion} = req.body;
        const fs = require('fs')

        if(result.errors.length > 0){
            //en caso de que haya errores por los campos de texto la imagen se crea igual, asi q la elimino (si es q envian una)
            if(req.file) fs.unlinkSync(req.file.path);
            return res.render("posts/add", {
                errors: result.mapped(),
                oldData: req.body
            });
        }
        
        const publicacion = await Publicacion.create({
            nombre: nombre,
            descripcion: descripcion,
            url_foto: req.file.filename,
            usuario_id: req.session.usuario.id
        })

        res.redirect("/myPosts")
    }

}

module.exports = controlador;