const { validationResult } = require("express-validator");
const Tarjeta = require("../database/models/Tarjeta");
const Donacion = require("../database/models/Donacion");
const { sendNotificationToMail } = require("../globals");


const controlador = {
    index: (req, res) => {
        res.render("index");
    },
    donate: (req, res) => {
        res.render("donations/index");
    },
    donateCard:(req, res) =>{
        res.render("donations/cardDonate");
    },
    donateCardProccess: async (req, res) =>{
        const result = validationResult(req);
        const {nro_tarjeta, nombre, codigo, fecha, monto} = req.body;

        if(result.errors.length > 0){
            return res.render("donations/cardDonate", {
                errors: result.mapped(),
                oldData: req.body
            });
        }

        const tarjeta = await Tarjeta.findOne(
            {where: {numero: nro_tarjeta, nombre: nombre, cdo_seguridad: codigo, vencimiento: fecha} }
        );

        if (!tarjeta || tarjeta.credito < monto) {
            return res.render("donations/cardDonate", {
                msgError: "Hubo un problema con los datos, intentelo de nuevo",
                oldData: req.body
            });
        }

        await Tarjeta.update(
            {credito: tarjeta.credito - monto},
            {where: {numero: nro_tarjeta} }
        );
        await Donacion.create({
            nombre: req.session.usuario.nombre,
            apellido: req.session.usuario.apellido,
            telefono: req.session.usuario.telefono,
            dni: req.session.usuario.dni,
            tipo: "tarjeta",
            descripcion: monto,
        });

        sendNotificationToMail(req.session.usuario.mail, "Donacion realiza con exito", req.session.usuario.id, "Muchas gracias por la donacion. \nLe agradecemos desde el equipo de Caritas", "donation");

        res.render("donations/cardDonate", {
            msgOk: "Gracias por tu donación, el equipo de Cáritas te lo agradece",
        });
    }
}

module.exports = controlador;