const { validationResult } = require("express-validator");
const Publicacion = require("../database/models/Publicacion");
const Usuario = require("../database/models/Usuario");
const Categoria = require("../database/models/Categoria");
const Filial = require("../database/models/Filial");
const Oferta = require("../database/models/Oferta");
const Intercambio = require("../database/models/Intercambio");
const Notificacion = require("../database/models/Notificacion");


const getTodayOrTomorrow = () => {

    //el formato de fechas es YYYY-MM-DD, .toLocaleDateString() retorna DD/MM/YYYY, incluso puede q el mes (o dia) sea de un solo digito asi q hay q ponerle el 0 delante

    const changeDateFormat = f => {
        let fecha = f.toLocaleDateString().split("/");
        if(fecha[0].length == 1) fecha[0] = `0${fecha[0]}`
        if(fecha[1].length == 1) fecha[1] = `0${fecha[1]}`
        return fecha.reverse().join("-");
    }

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
        
        await Oferta.create({
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

        const notificacion_contenido = `${req.session.usuario.nombre} hizo una oferta por tu publicacion ${publicacion.nombre}`;

        await Notificacion.create({
            usuario_id: publicacion.Usuario.id,
            contenido: notificacion_contenido,
            tipo: "receivedOffers"
        });

        res.redirect("/profile/sentOffers/orderByASC");
    },
    acceptOffer: async (req, res) => {
        const idURL = req.params.id;
        //ahora que no pueden acceder por url (a menos q usen postman o una app asi) sino solo por el boton, me parece que no es necesario tanta logica, 
        //van a aparecer los botones solo si tenes ofertas pendientes en publicaciones de tu autoridad (solo haria falta el id)
        const oferta = await Oferta.findOne ({
            include: [ 
                {
                    model: Publicacion,
                    where: {usuario_id: req.session.usuario.id} //devolveme las publicaciones de mi autoria
                },
                Filial, Publicacion, Usuario
            ], 
            where: {
                id: idURL //hace un innerjoin entre el id de oferta de la url con mis publicaciones
            } 
        } );

        //antes solo buscaba la oferta, permitiendo que cualquiera acepte la oferta
        //ahora solo va a poder aceptar la oferta el autor de la publicacion, busca la oferta pero el innerjoin es con publicaciones del usuario loggeado, si la oferta no es para alguna de esas publicaciones, el usuario no podra aceptar la oferta

        if(!oferta) return res.render("error404");


        const rechazarOferta = async (oferta) => {
            await Oferta.update({
                estado: "rechazada automaticamente" 
            },
            {
                where:{
                id: oferta.id
                }
            })
        
            const notificacion_contenido = `La publicacion ${oferta.Publicacion.nombre} no esta disponible por el momento!`;
        
            const notificacion = await Notificacion.create({
                usuario_id: oferta.Usuario.id,
                contenido: notificacion_contenido,
                tipo: "sentOffers"
            });
        }

        const intercambio = await Intercambio.create({
            publicacion_id: oferta.publicacion_id,
            oferta_id: oferta.id,
            estado: "pendiente",
        })

        await Oferta.update({
                estado: "aceptada" 
            },
            {
                where:{
                id: oferta.id
                }
            }
        )
        //ahora no deberian ver la publicacion ni hacerle ofertas
        await Publicacion.update({
            estado: "pendiente" 
        },
        {
            where:{
            id: oferta.publicacion_id
            }
        }
    )

        const ofertasARechazar = await Oferta.findAll ({where: {
            publicacion_id: oferta.publicacion_id,
            estado: "pendiente"
        } } )

        ofertasARechazar.forEach(oferta => rechazarOferta(oferta))


        const notificacion_contenido = `${req.session.usuario.nombre} aceptó tu oferta por la publicacion ${oferta.Publicacion.nombre}`;

        const notificacion = await Notificacion.create({
            usuario_id: oferta.Usuario.id,
            contenido: notificacion_contenido,
            tipo: "sentOffers"
        });

        res.redirect("/profile/myExchanges")
    },
    rejectOffer: async (req, res) => {
        const idURL = req.params.id;

        const oferta = await Oferta.findOne ({
            include: [ 
                {
                    model: Publicacion,
                    where: {usuario_id: req.session.usuario.id}
                },
                Filial, Publicacion, Usuario
            ], 
            where: {
                id: idURL
            } 
        } );

        if(!oferta) return res.render("error404");

        await Oferta.update({
                estado: "rechazada" // Marca el registro como eliminado
            },
            {
                where:{
                id: oferta.id
                }
            }
        )

        const notificacion_contenido = `${req.session.usuario.nombre} rechazó tu oferta por la publicacion ${oferta.Publicacion.nombre}`;

        const notificacion = await Notificacion.create({
            usuario_id: oferta.Usuario.id,
            contenido: notificacion_contenido,
            tipo: "sentOffers"
        });
        //al agregar filtros para ver las ofertas, no hay solo una url para navegar, asi que ya no debo redirigir explicitamente a "/profile/receiveOffers" xq puede ser tambien "/profile/receiveOffers/filterByPendientes", en cualquiera de los casos al rechazar una oferta voy la url "/rejectOffer/idRandom", con el valor back le indico de la url actual, volve de donde llegaste
        //funciona bien si el usuario hace todo por botone si ingresa url manual y va a volver a paginas anteriores(solo del sistema)
        res.redirect("back")
    }      
}

module.exports = controlador;