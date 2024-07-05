const { validationResult } = require("express-validator");
const Tarjeta = require("../database/models/Tarjeta");
const Donacion = require("../database/models/Donacion");
const { sendNotificationToMail } = require("../globals");

const controlador = {
    donate:(req, res) =>{
        res.render("donations/index");
    },
    donateProccess: async (req, res) =>{
        const result = validationResult(req);
        if(result.errors.length > 0){
            //en caso de que haya errores por los campos de texto la imagen se crea igual, asi q la elimino (si es q envian una)
            return res.render("donations/index", {
                errors: result.mapped(),
                oldData: req.body,
            });
        }
        const tarjeta = await Tarjeta.findOne(
            {where: {numero: req.body.nro_tarjeta} }
        );
        await Tarjeta.update(
            {credito: tarjeta.credito - req.body.monto},
            {where: {numero: req.body.nro_tarjeta} }
        );
        await Donacion.create({
            nombre: req.session.usuario.nombre,
            apellido: req.session.usuario.apellido,
            telefono: req.session.usuario.telefono,
            dni: req.session.usuario.dni,
            tipo: "tarjeta",
            descripcion: req.body.monto,
        });

        sendNotificationToMail(req.session.usuario.mail, "Donacion realiza con exito", req.session.usuario.id, "Muchas gracias por la donacion. \nLe agradecemos desde el equipo de Caritas", "donation");

        res.redirect("/");
    }

}

module.exports = controlador;