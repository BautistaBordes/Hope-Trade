const { body } = require("express-validator")
const Voluntario = require("../../database/models/Voluntario");
const Representante = require("../../database/models/Representante");

const validationsRegisterVoluntario = [
    body("nombre").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .matches(/^[a-zA-Z\s]*$/).withMessage("Solo se permiten letras"),
    

    body("apellido").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .matches(/^[a-zA-Z\s]*$/).withMessage("Solo se permiten letras"),
    
    
    body("mail").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isEmail().withMessage("Formato invalido")
    .custom( async value => {
        const usuario = await Voluntario.findOne({ where: { mail: value } });
        if (usuario)  throw new Error("ya fue utilizado ese mail")
        return true;
    })
    .custom( async value => {
        const usuario = await Representante.findOne({ where: { mail: value } });
        if (usuario)  throw new Error("ya fue utilizado ese mail")
        return true;
    })

    
];

module.exports = validationsRegisterVoluntario;