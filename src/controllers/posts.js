const { validationResult } = require("express-validator");
const { Op, where } = require('sequelize');
const Publicacion = require("../database/models/Publicacion");
const Usuario = require("../database/models/Usuario");
const Categoria = require("../database/models/Categoria");
const Comentario = require("../database/models/Comentario");
const {sendNotificationToMail} = require('../globals');


let volverAgregarPublicacion; //en esta variable guardo la url de donde vine para crear una publicacion inicialmente, si hay errores el link del boton cancelar se mantiene igual

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
        volverAgregarPublicacion = req.get('referer') || '/posts';
        const categories = await Categoria.findAll();
        res.render("posts/add", {categorias: categories, volverAgregarPublicacion});
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
                categorias: categories,
                volverAgregarPublicacion
            });
        }
        
        await Publicacion.create({
            nombre: nombre.toLowerCase(),
            descripcion: descripcion,
            url_foto: req.file.filename,
            usuario_id: req.session.usuario.id,
            categoria_id: categoria,
            estado: "disponible"
        })

        res.redirect("/profile/myPosts")
    },
    detailPost: async(req, res) =>{
        try {
            const idURL = req.params.id;
        
            const publicacion = await Publicacion.findOne({ include: [Usuario, Categoria] , where: {
                id: idURL,
                estado: {[Op.or] : ["disponible", "pendiente"]} 
            }});
    
            //si el post no existe o existe pero vos no sos el autor y esta en estado pendiente no la podes mirar
            const esMia = req.session.usuario.id === publicacion?.usuario_id;
            if(!publicacion || (publicacion.estado === "pendiente" && !esMia ) ) return res.render("error404");

 

            let referer =  req.get('referer');
            if (!referer || referer.includes("sentOffers") || referer.includes("receivedOffers") || referer.includes("offers") || referer.includes("posts/") ) {
                if ( esMia ) referer = "/profile/myPosts";
                else referer = "/posts";
            } else  referer = `/${referer.split("/").splice(3).join("/")}`
    
            const comentarios = await Comentario.findAll({include: Usuario, where: {publicacion_id: idURL, estado: "visible"}, order: [['id', 'DESC']] } )

            res.render("posts/detail", { publicacion, referer, esMia, comentarios });

        } catch (error) {
            console.log(error);
            res.status(500).send("error al ver detalle de publicacion")
        }

    },
    uploadComment: async (req, res) => {
        const {comentario} = req.body;
        const idURL = req.params.id;

        if (comentario.length < 1) return res.redirect(`/posts/${idURL}`);

        try {
            await Comentario.create({
                usuario_id: req.session.usuario.id,
                publicacion_id: idURL,
                contenido: comentario,
                estado: "visible"
            });

            const publicacion = await Publicacion.findOne({where: {id: idURL}})

            const ownerPost = await Usuario.findOne( { where: {id: publicacion.usuario_id} } )

            sendNotificationToMail(ownerPost.mail, "Recibiste un comentario", ownerPost.id, `${req.session.usuario.nombre} comentó en ${publicacion.nombre}`, "comment");

            res.redirect(`/posts/${idURL}#section-comments`);
        } catch (error) {
            console.log(error);
            res.status(500).send("error al cargar comentario")
        }

    },
    uploadReply: async (req,res) => {
        const {respuesta, publicacionID} = req.body;
        const comentarioID = req.params.id;

        try {
            await Comentario.create({
                usuario_id: req.session.usuario.id,
                comentario_padre_id: comentarioID,
                publicacion_id: publicacionID,
                contenido: respuesta,
                estado: "visible"
            });


            const publicacion = await Publicacion.findOne({where: {id: publicacionID}})

            const comentario = await Comentario.findOne({where: {id: comentarioID}})

            const autorComment = await Usuario.findOne( { where: {id: comentario.usuario_id} } )

            sendNotificationToMail(autorComment.mail, "Recibiste una respuesta", autorComment.id, `${req.session.usuario.nombre} te respodió en la publicacion ${publicacion.nombre}`, "comment");

            res.redirect(`/posts/${publicacionID}#section-comments`);
        } catch (error) {
            console.log(error);
            res.status(500).send("error al responder comentario")
        }
    },
    deleteComment: async (req,res) => {
        const comentarioID = req.params.id;
        const {publicacionID} = req.body;

        try {
            await Comentario.update( { estado: "borrado" },
            {
                where: { id: comentarioID }
            });

            const respuesta = await Comentario.findOne({where: {comentario_padre_id: comentarioID}})

            if(respuesta) {
                await Comentario.update( { estado: "borrado" },
                    {
                        where: { id: respuesta.id }
                });
            }

            const publicacion = await Publicacion.findOne({where: {id: publicacionID}})

            const comentario = await Comentario.findOne({where: {id: comentarioID}})

            const autorComment = await Usuario.findOne( { where: {id: comentario.usuario_id} } )

            sendNotificationToMail(autorComment.mail, "Recibiste una respuesta", autorComment.id, `${req.session.usuario.nombre} elimino tu comentario en la publicacion ${publicacion.nombre}`, "comment");


            res.redirect(`/posts/${publicacionID}#section-comments`);
        } catch (error) {
            console.log(error);
            res.status(500).send("error al eliminar comentario")
        }
    }
}

module.exports = controlador;