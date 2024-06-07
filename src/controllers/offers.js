const { validationResult } = require("express-validator");
const { createNotification, sendNotificationToMail, changeDateFormat } = require('../globals')
const Publicacion = require("../database/models/Publicacion");
const Usuario = require("../database/models/Usuario");
const Categoria = require("../database/models/Categoria");
const Filial = require("../database/models/Filial");
const Oferta = require("../database/models/Oferta");
const Intercambio = require("../database/models/Intercambio");


const getTodayOrTomorrow = () => {
    let fecha = new Date();
    let horario = fecha.toLocaleTimeString().slice(0,-3); //guardo horario local y le saco los segundos 19:30:23 -> 19:30
    if(horario >= "20:00") fecha.setDate(fecha.getDate() + 1); //si llega al caso limite le suma un dia, si es el ultimo dia del mes pasa al 1ero del siguiente
    return changeDateFormat(fecha); //me devuelve la fecha en un string con formato valido

}


const controlador = {
    create: async (req, res) => {
        const idURL = req.params.id;

        const publicacion = await Publicacion.findOne({ include: [Usuario] , where: {
            id: idURL,
            estado: "disponible"
        }});

        //si la publicacion no existe o si yo soy el autor de la publicacion no me dejes ofertar
        if (!publicacion || req.session.usuario.id == publicacion.usuario_id){
            return res.render("error404");
        }

        const filiales = await Filial.findAll();
        const categorias = await Categoria.findAll();

        //logica para horario local si hoy son las 20hs no podes hacer oferta en ninguna filial, arrancas el otro dia 
        const diaMinimo = getTodayOrTomorrow()

        res.render("offers/add", {
            publicacion: publicacion,
            filiales: filiales,
            categorias: categorias,
            hoy: diaMinimo
        });
    },
    createProccess: async (req, res) => {
        const result = validationResult(req);

        const idURL = req.params.id;
        const publicacion = await Publicacion.findOne({ include: [Usuario] , where: {
            id: idURL
            //estado: "disponible"?? en si a este controller vienen de una solicitud post o sea del formulario o q usen postman o una app asi,
            //si vienen del formulario es que solo vieron una publicacion que esta disponible sino renderiza el error 404.
        }});
        const categories = await Categoria.findAll();
        const filiales = await Filial.findAll();
        const diaMinimo = getTodayOrTomorrow();

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
                hoy: diaMinimo
            });
        }
        
        const oferta= await Oferta.create({
            nombre: nombre,
            descripcion: descripcion,
            url_foto: req.file.filename,
            usuario_id: req.session.usuario.id,
            categoria_id: categoria,
            fecha: fecha,
            hora: hora,
            publicacion_id: idURL,
            filial_id: filial,
            estado: "pendiente"
        });

        const contenido = `${req.session.usuario.nombre} te envio la oferta "${oferta.nombre}" por tu publicacion "${publicacion.nombre}"`;

        createNotification(publicacion.usuario_id, contenido, "receivedOffers");
        //sendNotificationToMail(publicacion.Usuario.mail, "Oferta Recibida", publicacion.usuario_id, contenido, "receivedOffers");


        res.redirect("/profile/sentOffers/orderByASC");
    },
    acceptOffer: async (req, res) => {
        const idURL = req.params.id;
        const referer = req.get('Referer');
        //ahora que no pueden acceder por url (a menos q usen postman o una app asi) sino solo por el boton, me parece que no es necesario tanta logica, 
        //van a aparecer los botones solo si tenes ofertas pendientes en publicaciones de tu autoridad (solo haria falta el id)
        const oferta = await Oferta.findOne ({
            include: [ Publicacion], 
            where: { id: idURL } 
        });


        await Intercambio.create({
            publicacion_id: oferta.publicacion_id,
            oferta_id: oferta.id,
            estado: "pendiente"
        });

        await Oferta.update( { estado: "aceptada" }, { where: { id: oferta.id } });
        
        await Oferta.update( { estado: "pausada" }, { where: {publicacion_id: oferta.publicacion_id, estado: "pendiente" } });

        //ahora no deberian ver la publicacion ni hacerle ofertas
        await Publicacion.update( { estado: "pendiente" }, { where: { id: oferta.publicacion_id }});

        const contenido = `${req.session.usuario.nombre} aceptó tu oferta ${oferta.nombre}, por la publicacion ${oferta.Publicacion.nombre}`;

        createNotification(oferta.usuario_id, contenido, "sentOffers");
        //sendNotificationToMail(oferta.Usuario.mail, "Oferta rechazada", oferta.usuario_id, contenido, "sentOffers");


        res.redirect(referer);
    },
    rejectOffer: async (req, res) => {
        const idURL = req.params.id;

        //como tengo filtros y orden tengo mas de una url asi que ya no debo redirigir explicitamente a "/profile/receiveOffers", en cualquiera de los casos al rechazar una oferta voy la url "/rejectOffer/idRandom", con el valor referer obtengo la url anterior que me hizo llegar a la actual
        //funciona bien si el usuario hace todo por botone si ingresa url manual y va a volver a paginas anteriores(solo del sistema)
        const referer = req.get('Referer');

        const oferta = await Oferta.findOne ({
            include: [ Publicacion], 
            where: { id: idURL } 
        });


        await Oferta.update( { estado: "rechazada" }, { where: { id: oferta.id } });

        //le aviso al que me envio la oferta que lo rechace
        const contenido = `${req.session.usuario.nombre} rechazó tu oferta ${oferta.nombre}, por la publicacion ${oferta.Publicacion.nombre}`;

        createNotification(oferta.usuario_id, contenido, "sentOffers");
        //sendNotificationToMail(oferta.Usuario.mail, "Oferta rechazada", oferta.usuario_id, contenido, "sentOffers");


        res.redirect(referer);
    },
    createContraOffer: async(req, res) => {
        try {   
            const idURL = req.params.id;

            const oferta = await Oferta.findOne({ include: [Usuario, Filial] , where: {
                id: idURL,
                estado: "pendiente"
            }});
    
            //si la oferta no existe o si yo soy el autor de la oferta no me dejes ofertar
            if (!oferta || req.session.usuario.id == oferta.usuario_id){
                return res.render("error404");
            }
    
            const filiales = await Filial.findAll();
    
            //logica para horario local si hoy son las 20hs no podes hacer oferta en ninguna filial, arrancas el otro dia 
            const diaMinimo = getTodayOrTomorrow()
    
            res.render("offers/addContraOffer", {
                oferta: oferta,
                filiales: filiales,
                hoy: diaMinimo
            });
        } catch (error) {
            console.log(error)
        }
    },
    createContraOfferProccess: async (req, res) => {
        try {
            const result = validationResult(req);
            const idURL = req.params.id;
            const {filialNueva, fechaNueva, horaNueva} = req.body;
            const ofertaVieja = await Oferta.findOne({ include: [Usuario, Filial, Publicacion] , where: {
                id: idURL,
                estado: "pendiente"
            }});
            
            const filiales = await Filial.findAll();
    
            const diaMinimo = getTodayOrTomorrow();

            if (result.errors.length > 0) {
                return res.render("offers/addContraOffer", {
                    errors: result.mapped(),
                    oldData: req.body,
                    oferta: ofertaVieja,
                    filiales: filiales,
                    hoy: diaMinimo
                });
            }

            //la otra oferta no debe seguir vigente sino le puedo seguir haciendo contraofertas infinitamente
            await Oferta.update({ estado: "contraofertada" }, {where: {id: ofertaVieja.id} } );

            //creo la nueva oferta con datos anteriores
            await Oferta.create({
                nombre: ofertaVieja.nombre,
                descripcion: ofertaVieja.descripcion,
                url_foto: ofertaVieja.url_foto,
                usuario_id: req.session.usuario.id,
                categoria_id: ofertaVieja.categoria_id,
                publicacion_id: ofertaVieja.publicacion_id,
                oferta_padre_id: ofertaVieja.id,
                fecha: fechaNueva,
                hora: horaNueva,
                filial_id: filialNueva,
                estado: "pendiente"
            });

            const contenido = `${req.session.usuario.nombre} le interesa tu oferta ${ofertaVieja.nombre} por la publicacion ${ofertaVieja.Publicacion.nombre} pero propuso otro lugar u otra fecha`;

            createNotification(ofertaVieja.usuario_id, contenido, "receivedOffers");

            res.redirect("/profile/sentOffers/orderByDESC");
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = controlador;