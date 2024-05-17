const { body } = require("express-validator")
const Usuario = require("../database/models/Usuario");




const validationsRegister = [
    body("nombre").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .matches(/^[a-zA-Z\s]*$/).withMessage("Solo se permiten letras"),
    

    body("apellido").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .matches(/^[a-zA-Z\s]*$/).withMessage("Solo se permiten letras"),
    

    body("dni").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isInt().withMessage("Solo se se aceptan numeros").bail()
    .custom( async value => {
        const usuario = await Usuario.findOne({ where: { dni: value } });
        if (usuario)  throw new Error("ya existe ese dni")
        return true;
    }),

    
    body("mail").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isEmail().withMessage("Formato invalido"),


    body("password").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isLength({min:6}).withMessage("Deben 6 caracteres como minimo"),


    body("telefono").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isInt().withMessage("Solo numeros"),

    body("fecha").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .custom(value => {
        const hoy = new Date(); const fechaIngresada = new Date(value);
        let age = hoy.getFullYear() - fechaIngresada.getFullYear();

        if(fechaIngresada.getMonth() > hoy.getMonth()) age--;
        else if(fechaIngresada.getMonth() == hoy.getMonth()){
            if(fechaIngresada.getUTCDate() > hoy.getDate() ) age--; 
        }
        
        if (age < 18) throw new Error("Solo mayores de edad");

        return true; 
    })
];

module.exports = validationsRegister;