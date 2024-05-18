const { body } = require("express-validator")

const validationsLogin = [
    
    body("dni_mail").trim()
    .notEmpty().withMessage("No puede estar vacio"),


    body("password").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isLength({min:6}).withMessage("Deben 6 caracteres como minimo"),

];

module.exports = validationsLogin;