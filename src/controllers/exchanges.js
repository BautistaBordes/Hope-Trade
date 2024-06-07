
const { createNotification, sendNotificationToMail, changeDateFormat } = require('../globals')
const Publicacion = require("../database/models/Publicacion");
const Usuario = require("../database/models/Usuario");
const Oferta = require("../database/models/Oferta");
const Intercambio = require("../database/models/Intercambio");
const Filial = require("../database/models/Filial");


const getTodayOrTomorrow = () => {
    let fecha = new Date();
    let horario = fecha.toLocaleTimeString().slice(0,-3); //guardo horario local y le saco los segundos 19:30:23 -> 19:30
    if(horario >= "20:00") fecha.setDate(fecha.getDate() + 1); //si llega al caso limite le suma un dia, si es el ultimo dia del mes pasa al 1ero del siguiente
    return changeDateFormat(fecha); //me devuelve la fecha en un string con formato valido

}


const controlador = {
    acceptExchange: async (req, res) => {
        const idURL = req.params.id;
        const referer = req.get('Referer');

        //puedo aceptar un intercambio si es uno que 1_existe 2_esta en la filial donde trabajo yo
        const intercambio = await Intercambio.findOne({
            include: [ {model: Oferta, where: {filial_id: req.session.usuario.filial_id }, include : [Filial] }, Publicacion  ], 
            where: { id: idURL } 
        });


        await Intercambio.update({estado: "confirmado"}, {where: {id: intercambio.id} });
        
        
        await Publicacion.update({estado: "intercambiada"}, {where: { id: intercambio.publicacion_id}});
        

        const ofertas = await Oferta.findAll({where: {estado: "pausada", publicacion_id: intercambio.publicacion_id}, include: [Usuario]   } );

        ofertas.forEach(async oferta => {

            await Oferta.update({estado: "rechazada"}, {where: {id: oferta.id} } )


            const contenido = `La publicacion ${intercambio.Publicacion.nombre} para la que ofertaste ${oferta.nombre} no esta disponible`

            createNotification(oferta.usuario_id, contenido, "sentOffers")
        })
        

        res.redirect(referer);
    },
    rejectExchange: async (req, res) => {
        const idURL = req.params.id;
        const referer = req.get('Referer');

        const intercambio = await Intercambio.findOne({
            include: [ {model: Oferta, where: {filial_id: req.session.usuario.filial_id }, include : [Filial] }, Publicacion  ], 
            where: { id: idURL } 
        });

        await Intercambio.update({estado: "rechazado"}, {where: {id: intercambio.id} });

        await Oferta.update({estado: "rechazada"}, {where: {estado: "aceptada"}});

        await Oferta.update({estado: "pendiente"}, {where: {estado: "pausada"}});

        await Publicacion.update({estado: "disponible"}, {where: { id: intercambio.publicacion_id}});

        let usuarioOferta = await Usuario.findOne({ where: { id: intercambio.Oferta.usuario_id } });

        const usuarioPublicacion = await Usuario.findOne({ where: { id: intercambio.Publicacion.usuario_id } });

        if(usuarioOferta.id === usuarioPublicacion.id) {
                const ofertaPadre = await Oferta.findOne({where: intercambio.Oferta.oferta_padre_id  })
                usuarioOferta =  await Usuario.findOne({ where: { id: ofertaPadre.usuario_id } });
        }

        const contenido = `Se rechazo el intercambio entre la publicacion ${intercambio.Publicacion.nombre}  y la oferta ${intercambio.Oferta.nombre}, programado para el ${intercambio.Oferta.fecha} a las ${intercambio.Oferta.hora.slice(0,-3)} en la filial ${intercambio.Oferta.Filial.nombre} `;

        createNotification(usuarioOferta.id, contenido, "exchanges");
        //sendNotificationToMail(usuarioOferta.mail, "Intercambio rechazado", usuarioOferta.id, contenido, "exchanges");

        createNotification(usuarioPublicacion.id, contenido, "exchanges");
        //sendNotificationToMail(usuarioPublicacion.mail, "Intercambio rechazado", usuarioPublicacion.id, contenido, "exchanges");

        res.redirect(referer);
    }
}

module.exports = controlador;