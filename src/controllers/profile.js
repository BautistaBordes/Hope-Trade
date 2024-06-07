const { validationResult } = require("express-validator")
const bcrypt = require('bcryptjs');
const { Op, where } = require('sequelize');
const { createNotification, sendNotificationToMail, changeDateFormat } = require('../globals')
const Publicacion = require("../database/models/Publicacion");
const Usuario = require('../database/models/Usuario') 
const Representante = require('../database/models/Representante') 
const Voluntario = require('../database/models/Voluntario') 
const Categoria = require("../database/models/Categoria");
const Oferta = require("../database/models/Oferta");
const Filial = require("../database/models/Filial");




//offers puede que contenga ofertas solo de tipo pendiente o de todos los estados (pero no solo de rechazadas o de aceptadas)
const rejectOldOffers = async (offers) => {

    const fecha = new Date();
    const hoy = changeDateFormat(fecha);
    const horario = fecha.toLocaleTimeString().slice(0,-3); // al horario le saco los segundos y queda el string HH:MM (hora y minuto)

    //en caso de que no haya ofertas pendientes antiguas, devuelvo las ofertas normalmente, caso contrario las actualizo
    let ofertas = offers.filter(offer => offer.estado == "pendiente" && (offer.fecha < hoy || (offer.fecha == hoy  && offer.horario < horario ) ));
    if (ofertas.length != 0){
        //x lo q entendi: filter crea un arreglo nuevo con los elementos que cumplen la condicion, pero esos elementos apuntan al mismo lugar (si no son primitivos)
        const ofertasAActualizar = ofertas.map(async (oferta) => {
            await Oferta.update( { estado: "rechazada" }, { where: { id: oferta.id }  } );
    
            //si bien actualizas en la bd el valor, no se hace un findall de nuevo de la oferta, hay que actualizar el valor manualmente en el objeto
            oferta.estado = "rechazada";
    
            const contenido = `Se rechazó automaticamente tu oferta por la publicacion ${oferta.Publicacion.nombre}`;

            createNotification(oferta.usuario_id, contenido, "sentOffers");
            //sendNotificationToMail(oferta.Usuario.mail, "Oferta rechazada", oferta.usuario_id, contenido, "sentOffers");
    
            return oferta;
        }); 
        await Promise.all(ofertasAActualizar)
    }
    return offers;
}


//antes al ver las ofertas no habia orden ni filtro, siempre se TODAS las ofertas en un mismo orden, al agregarle filtros las queries devuelven diferentes objetos
const getOffers = async (req, res, title, url) => {

    // valores: undefined es xq no tiene filtro se ven todas, sino se filtra x pendientes, aceptadas y rechazadas
    //x defecto es orden ascendente, el otro valor es descendente que se ven todas las nuevas primero
    try {
        const { filterBy: filterParam, orderBy: orderParam } = req.params;

        let objetoFiltro = undefined;
        if (filterParam) {
            if (filterParam === "filterByPendientes") objetoFiltro = { estado: "pendiente" };
            else if (filterParam === "filterByRechazadas") objetoFiltro = { estado: { [Op.or]: ["rechazada", "rechazada automaticamente"] } };
            else if (filterParam === "filterByAceptadas") objetoFiltro = { estado: "aceptada" };
            //si escribe algo que no sea algun filtro se redirige al caso default
            else return res.redirect(`/profile/${url}/orderByASC`);
        }
        
        let objetoOrden = [['id', 'ASC']];
        if (orderParam === "orderByDESC") objetoOrden = [['id', 'DESC']];
        else if (orderParam !== "orderByASC") return res.redirect(`/profile/${url}/orderByASC`);

        let objIncludeWhereOrder;
        let ofertas;
        if (url === "receivedOffers") {
            /*
            tenes 3 escenarios al ver las ofertas recibidas, 
            1_subiste una publicacion y te hacen una oferta, 
            2_otro usuario hizo una publicacion, hiciste una oferta y el otro usuario te envio una contraferta
            3_subiste una publicacion, "juan" te hizo una oferta, vos le hiciste una contraoferta a "juan" y "juan" te hizo una contraoferta a esa que hiciste vos


            entonces:
            en nuestro diseño de tabla de oferta, 3 valores importantes
            id: identificacion de cada oferta
            publicacion_id: indicas a que publicacion esta ligada la oferta (aca comenzo todo)
            oferta_padre_id: indica que ES una contraoferta, xq le responde a otra que es su padre, si es una oferta a una publicacion directa, tiene valor null

    
            entonces pense en 2 filtros
            1_ primero devolveme todas las ofertas ligadas a mis publicaciones pero puede haber contraofertas q hice yo que esten ligadas a una publicacion mia, asi que ademas esas ofertas NO tienen que ser mias.

            2_por otro lado yo quiero ver las contraofertas relacionadas a publicaciones ajenas que me enviaron respondiendo a una oferta/contraoferta mia.
            x lo cual quiero las ofertas que esten ligadas a publicaciones que no sean mias, y que tengan como oferta_padre una oferta mia, o sea me estan respondiendo a mi.
            */

            objIncludeWhereOrder = {
                include: [{model: Publicacion, where: { usuario_id: req.session.usuario.id } },
                      Usuario, Filial, Categoria],
                where: { ...objetoFiltro, usuario_id: { [Op.ne]: req.session.usuario.id }},  
                order: objetoOrden
            };

            ofertas = await Oferta.findAll(objIncludeWhereOrder)

            objIncludeWhereOrder = {
                include: [ {model: Oferta, as: 'oferta_padre', where: { usuario_id: req.session.usuario.id  } }, 
                {model: Publicacion, where: { usuario_id: { [Op.ne]: req.session.usuario.id } } },
                Usuario, Filial, Categoria ],
                where: {...objetoFiltro},
                order: objetoOrden
            }

            let contraOfertas = await Oferta.findAll(objIncludeWhereOrder);
            
            ofertas = ofertas.concat(contraOfertas);

            if(ofertas.length > 0 && filterParam !== "filterByRechazadas" && filterParam !== "filterByAceptadas") ofertas = await rejectOldOffers(ofertas);
 
        } else {
            objIncludeWhereOrder = {
                include: [Publicacion, Usuario, Filial,Categoria],
                where: { usuario_id: req.session.usuario.id, ...objetoFiltro },
                order: objetoOrden
            };

            ofertas = await Oferta.findAll(objIncludeWhereOrder)
        }


        res.render("offers/index", {
            ofertas: ofertas,
            title: title,
            filter: filterParam,
            order: orderParam
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("error al obtener las ofertas") // despues hacer una vista para renderizar
    }
}


let volverCambiarContrasenia;  //en esta variable guardo la url de donde vine para cambiar la contraseña inicialmente, si hay errores el link del boton cancelar se mantiene igual

const controlador ={
    myPost: async (req, res) => {
        try {
            const publicaciones = await Publicacion.findAll( { include: [Usuario, Categoria], 
                where: {
                    usuario_id:  req.session.usuario.id,
                    estado: { [Op.or]: ["disponible", "pendiente"]  }
                }
            });
        
            res.render("posts/index", {
                publicaciones: publicaciones, title: "Mis publicaciones"
            });
        } catch (error) {
            console.log(error);
            res.status(500).send("error al ver mis publicaciones")
        }

    },
    changePassword: (req,res) => {
        volverCambiarContrasenia = req.get('referer') ?  `/${req.get('referer').split("/").splice(3).join("/")}` : (req.session.usuario.rol === "comun" ? "/posts" : "/controlPanel" );

        res.render('sessions/changePassword', { volverCambiarContrasenia})
    },
    changePasswordProcess: async (req,res)=> {
        const result = validationResult(req);
        let rol = req.session.usuario.rol;

        if(result.errors.length > 0){
            return res.render("sessions/changePassword", {
                errors: result.mapped(),
                msgError: "Hubo un problema con los datos para cambiar la contraseña",
                oldData: req.body,
                volverCambiarContrasenia
            });
        }
        let userModel;
        if ( rol == 'comun' ) userModel = Usuario;
        else if ( rol == 'representante') userModel = Representante;
        else userModel = Voluntario;
        

        const encryptedPassword = bcrypt.hashSync(req.body.new_psw, 10);
  
        try {
            const usuario = await userModel.update({
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
    },
    receivedOffers: async (req, res) => {
        getOffers(req, res, "Ofertas Recibidas", "receivedOffers");
    },
    sentOffers: async (req, res) => {
        getOffers(req, res, "Ofertas Enviadas", "sentOffers");
    }
}

module.exports = controlador;