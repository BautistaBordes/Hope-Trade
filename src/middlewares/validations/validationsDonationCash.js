const { body } = require("express-validator")


const validationDonation = [
    body("nombre")
    .notEmpty().withMessage("No puede estar vacio"),
    body("apellido")
    .notEmpty().withMessage("No puede estar vacio"),
    body("telefono")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isNumeric(),
    body("dni")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isNumeric(),
    
    body("monto")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isNumeric()

];

module.exports = validationDonation;