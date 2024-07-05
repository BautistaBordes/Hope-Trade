const { body } = require("express-validator")


const validationDonation = [
    body("nombre")
    .notEmpty().withMessage("No puede estar vacio"),

    body("apellido")
    .notEmpty().withMessage("No puede estar vacio"),

    body("telefono")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isInt().withMessage("Solo se se aceptan numeros"),

    body("dni")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isInt().withMessage("Solo se se aceptan numeros"),
    
    body("titulo")
    .notEmpty().withMessage("No puede estar vacio").bail()

];

module.exports = validationDonation;