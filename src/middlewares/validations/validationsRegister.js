const { body } = require("express-validator")
const Usuario = require("../../database/models/Usuario");

const changeDateFormat = f => {
    let fecha = f.toLocaleDateString().split("/");
    if(fecha[0].length == 1) fecha[0] = `0${fecha[0]}`
    if(fecha[1].length == 1) fecha[1] = `0${fecha[1]}`
    return fecha.reverse().join("-");
}


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
        const hoy = changeDateFormat(new Date()).split("-"); 
        const fechaIngresada = value.split("-");
        let age = hoy[0] - fechaIngresada[0];

        if(fechaIngresada[1] > hoy[1]) age--;
        else if(fechaIngresada[1] == hoy[1]){
            if(fechaIngresada[2] > hoy[2] ) age--; 
        }
        
        if (age < 18) throw new Error("Solo mayores de edad");

        return true; 
    })
];

module.exports = validationsRegister;