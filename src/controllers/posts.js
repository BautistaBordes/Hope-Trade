const { validationResult } = require("express-validator");
const { Op } = require('sequelize');
const Publicacion = require("../database/models/Publicacion");
const Usuario = require("../database/models/Usuario");
const Categoria = require("../database/models/Categoria");




const controlador = {
    index: async (req, res) => {
        const publicaciones = await Publicacion.findAll({ include: [Usuario, Categoria] , where: {
            usuario_id: {
                [Op.ne]: req.session.usuario.id
            },
            estado: "disponible"
        }});
        res.render("posts/index", {
            publicaciones: publicaciones, title: "Publicaciones"
        });
    },
    add: async (req, res) => {
        const categories = await Categoria.findAll();
        res.render("posts/add", {categorias: categories});
    },
    addProccess: async (req, res) => {
        const result = validationResult(req);
        const categories = await Categoria.findAll();
        const {nombre, descripcion, categoria} = req.body;
        const fs = require('fs')

        if(result.errors.length > 0){
            //en caso de que haya errores por los campos de texto la imagen se crea igual, asi q la elimino (si es q envian una)
            if(req.file) fs.unlinkSync(req.file.path);
            return res.render("posts/add", {
                errors: result.mapped(),
                oldData: req.body,
                categorias: categories
            });
        }
        
        await Publicacion.create({
            nombre: nombre,
            descripcion: descripcion,
            url_foto: req.file.filename,
            usuario_id: req.session.usuario.id,
            categoria_id: categoria,
            estado: "disponible"
        })

        res.redirect("/profile/myPosts")
    },
    detailPost: async(req, res) =>{
        const idURL = req.params.id;
        
        const publicacion = await Publicacion.findOne({ include: [Usuario, Categoria] , where: {
            id: idURL,
            estado: "disponible"
        }});

        if(!publicacion) return res.render("error404");

        res.render("posts/detail", {
            publicacion: publicacion
        })
    }

}

module.exports = controlador;