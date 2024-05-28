const Notificacion = require("../database/models/Notificacion");



const controlador = {
    view: async (req,res) =>{
        const notificaciones = await Notificacion.findAll({ where: {
            usuario_id: req.session.usuario.id
        }
        });


        //cambia el estado para la siguiente vez que se busque
        notificaciones.forEach(async notificacion=>{

            await Notificacion.update({
                estado: "vista" 
            },
            {
                where:{
                id: notificacion.id
                }
            });

        });

        res.render("notifications/index", {
            notificaciones : notificaciones
        });
    }

}

module.exports = controlador;