const { body } = require("express-validator")
const Tarjeta = require("../../database/models/Tarjeta");

let tarjeta;

const validationDonation = [
    body("nro_tarjeta")
    .notEmpty().withMessage("Complete el numero de tarjeta para continuar").bail()
    .custom(async (value, {req}) =>{
        
        tarjeta = await Tarjeta.findOne({ where: { numero: value } });

        if (!tarjeta) {
            throw new Error("El número de tarjeta no es valido");
        }
        
        return true;
    }),
    body("nombre")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .custom(async (value, {req}) =>{

        if ((tarjeta) && (tarjeta.nombre != value)){
            throw new Error("Nombre incorrecto");
        }

        return true;
    }),
    body("codigo")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .custom(async (value, {req}) =>{

        if ((tarjeta) && (tarjeta.cdo_seguridad != value)){
            throw new Error("Codigo de seguridad incorrecto");
        }

        return true;
    }),
    body("fecha")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .custom(async (value, {req}) =>{

        if ((tarjeta) && (tarjeta.vencimiento != value)){
            throw new Error("Vencimiento incorrecto");
        }

        return true;
    }),
    body("monto")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .custom(async (value, {req}) =>{

        if ((tarjeta) && (tarjeta.credito < value)){
            throw new Error("Saldo insuficiente!");
        }

        return true;
    }),

];

module.exports = validationDonation;