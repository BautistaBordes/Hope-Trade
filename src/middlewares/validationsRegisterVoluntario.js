const { body } = require("express-validator")


const validationsRegisterVoluntario = [
    body("nombre").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .matches(/^[a-zA-Z\s]*$/).withMessage("Solo se permiten letras"),
    

    body("apellido").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .matches(/^[a-zA-Z\s]*$/).withMessage("Solo se permiten letras"),
    
    
    body("mail").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isEmail().withMessage("Formato invalido"),
    // AGREGAR VALIDACION SI EXISTE EL MAIL

    
];

module.exports = validationsRegisterVoluntario;