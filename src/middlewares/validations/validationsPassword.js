const { body } = require("express-validator");
const Usuario = require("../../database/models/Usuario");
const Representante = require('../../database/models/Representante') 
const Voluntario = require('../../database/models/Voluntario') 
const bcrypt = require('bcryptjs');

const validationsPassword = [

    body("new_psw").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isLength({min:6}).withMessage("Debe tener 6 caracteres como minimo"),

    body('confirm_psw').trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .custom((value, { req }) => {
        if (value !== req.body.new_psw)
            throw new Error("No coinciden las contraseñas")
        return true;
      
    }),

    body("old_psw").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .custom( async (value, { req }) => {
        let rol = req.session.usuario.rol;
        if ( rol == 'comun')
            aux = Usuario
        else if ( rol == 'representante')
            aux = Representante
        else
            aux = Voluntario
        

        const usuario = await aux.findOne({ where: { id : req.session.usuario.id } });
        if (!bcrypt.compareSync(req.body.old_psw, usuario.password))
            throw new Error("Contraseña erronea")
        return true;
    }),
];

module.exports = validationsPassword;