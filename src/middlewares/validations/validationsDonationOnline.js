const { body } = require("express-validator")


const validationDonation = [
    body("nro_tarjeta")
    .notEmpty().withMessage("Complete el numero de tarjeta para continuar"),

    body("nombre")
    .notEmpty().withMessage("No puede estar vacio"),

    body("codigo")
    .notEmpty().withMessage("No puede estar vacio"),

    body("fecha")
    .notEmpty().withMessage("No puede estar vacio"),

    body("monto")
    .notEmpty().withMessage("No puede estar vacio")

];

module.exports = validationDonation;