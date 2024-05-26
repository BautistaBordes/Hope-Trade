const { validationResult } = require("express-validator");
const { Op } = require('sequelize');
const Publicacion = require("../database/models/Publicacion");
const Usuario = require("../database/models/Usuario");
const Categoria = require("../database/models/Categoria");
const Filial = require("../database/models/Filial");
const Oferta = require("../database/models/Oferta");



const controlador = {
    create: async (req, res) => {
        const id = req.params.id;

        

        const publicacion = await Publicacion.findOne({ include: [Usuario] , where: {
            id: id
        }});

        if (id == publicacion.usuario_id){
            return res.render("error404");
        }

        const filiales = await Filial.findAll();
        const categorias = await Categoria.findAll();
        const hoy = new Date().toISOString().split('T')[0];

        res.render("offers/add", {
            publicacion: publicacion,
            filiales: filiales,
            categorias: categorias,
            hoy: hoy
        });
    },
    createProccess: async (req, res) => {
        const result = validationResult(req);

        const id = req.params.id;
        const publicacion = await Publicacion.findOne({ include: [Usuario] , where: {
            id: id
        }});
        const categories = await Categoria.findAll();
        const filiales = await Filial.findAll();
        const hoy = new Date().toISOString().split('T')[0];

        const {nombre, descripcion, categoria, filial, fecha, hora} = req.body;
        const fs = require('fs')

        if(result.errors.length > 0){
            //en caso de que haya errores por los campos de texto la imagen se crea igual, asi q la elimino (si es q envian una)
            if(req.file) fs.unlinkSync(req.file.path);
            return res.render("offers/add", {
                errors: result.mapped(),
                oldData: req.body,
                publicacion: publicacion,
                categorias: categories,
                filiales: filiales,
                hoy: hoy
            });
        }
        
        const oferta = await Oferta.create({
            nombre: nombre,
            descripcion: descripcion,
            url_foto: req.file.filename,
            usuario_id: req.session.usuario.id,
            categoria_id: categoria,
            fecha: fecha,
            hora: hora,
            publicacion_id: req.params.id,
            filial_id: filial
        })

        res.redirect("/profile/myOffers")
    }
}

module.exports = controlador;